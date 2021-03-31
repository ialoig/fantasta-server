import { League } from '../../../database'
import { Errors, Response, leagueUtils, userUtils } from '../../../utils'
import { metricApiError, metricApiSuccess, metricApiPayloadSize } from '../../../metrics'
import * as Socket from 'socket.io'

const create = async (req, res, next) => {
    const duration_start = process.hrtime()

    let leagueData = req.body || {}

    try {
        const auth = await userUtils.userFromToken(req)
        let user = auth.user
        const userId = user._id

        let leagueSettings = leagueUtils.validateleague(leagueData, userId)
        let league = await League.create(leagueSettings)
        let team = await leagueUtils.createTeam(leagueData.teamname, leagueSettings.budget, userId, league._id)

        league.teams = [team._id]
        await league.save()

        user.leagues.push(league._id)
        await user.save()

        let response = await leagueUtils.createLeagueResponse(user, league, team)

        //TODO: preparare socket per eventi
        // Socket.addAttendee( req, newLeag.name, '' )
        // Socket.leagueCreate( req, newLeag.name, '' )

        metricApiSuccess("league.create", '', duration_start)
        metricApiPayloadSize("league.create", response)
        res.json(Response.resolve(response))
    }
    catch (error) {
        console.error(`[api] league.create: ${error}`)
        metricApiError("league.create", error, duration_start)
        res.status(400).send(Response.reject(error, req.headers.language))
    }
}

export default create

import { League } from '../../../database/index.js'
import { Constants, Response, leagueUtils, userUtils } from '../../../utils/index.js'
import { metricApiError, metricApiSuccess } from '../../../metrics/index.js'
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

        res.json(Response.resolve(Constants.OK, response))
    }
    catch (error) {
        console.error('League Create: ', error)
        metricApiError("league.create", Constants[error] || Constants.BAD_REQUEST, duration_start)
        res.status(400).send(Response.reject(Constants.BAD_REQUEST, Constants[error] || Constants.BAD_REQUEST, error, req.headers.language))
    }
}

export default create

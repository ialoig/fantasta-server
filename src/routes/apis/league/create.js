import { League, Market } from '../../../database'
import { Errors, Response, leagueUtils, userUtils } from '../../../utils'
import { metricApiError, metricApiSuccess, metricApiPayloadSize } from '../../../metrics'

const create = async (req, res, next) => {
    const duration_start = process.hrtime()

    const leagueBody = req.body || {}

    let leagueData = leagueUtils.validateleague(leagueBody)

    if (leagueData.valid) {
        try {
            const auth = await userUtils.userFromToken(req)
            let user = auth.user
            const userId = user._id

            let settings = leagueData.league
            settings.admin = userId

            // create league object
            let league = await League.create(settings)

            // create team object
            let team = await leagueUtils.createTeam(leagueBody.teamname, settings.budget, userId, league._id)

            league.teams = [team._id]
            await league.save()

            user.leagues.push(league._id)
            await user.save()

            let response = await leagueUtils.createLeagueResponse(user, league, team)
            console.log("[/league/create] - response=", response)
            metricApiSuccess("league.create", '', duration_start)
            metricApiPayloadSize("league.create", response)
            res.json(Response.resolve(response))
        }
        catch (error) {
            // Mongo duplicate key Error
            if (error.name === "MongoError" && error.code === 11000) {
                console.error(`[api] league.create: ${Errors.LEAGUE_ALREADY_EXISTS.status}`)
                metricApiError("league.create", Errors.LEAGUE_ALREADY_EXISTS, duration_start)
                res.status(400).send(Response.reject(Errors.LEAGUE_ALREADY_EXISTS, req.headers.language))
            }
            else {
                console.error(`[api] league.create: ${error}`)
                metricApiError("league.create", error, duration_start)
                res.status(400).send(Response.reject(error, req.headers.language))
            }
        }
    }
    else {
        console.error(`[api] league.create: ${leagueData.error}`)
        metricApiError("league.create", leagueData.error, duration_start)
        res.status(400).send(Response.reject(leagueData.error, req.headers.language))
    }
}

export default create

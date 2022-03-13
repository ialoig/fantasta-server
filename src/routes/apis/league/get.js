import { Errors, leagueUtils, Response, userUtils } from '../../../utils'
import { metricApiError, metricApiPayloadSize, metricApiSuccess } from '../../../metrics'
import { League, populate } from '../../../database'


const get = async (req, res, next) => {
    const duration_start = process.hrtime()
    try {

        const { leagueID } = req.query // { leagueID: '61efe018b73845071ce4e844' }
        console.log("[api] league.get - getting league from league id: ", leagueID)

        if (leagueID) {

            // get user object from token request
            const auth = await userUtils.userFromToken(req)
            const user = auth.user
            if (!user) {
                throw Errors.USER_NOT_FOUND
            }
            const userId = user._id
            await populate.user(user)
            console.log("[api] league.get - get user: ", user.username)

            // get league object from user's array of leagues
            let league = user.leagues.find(league => league._id == leagueID) || null
            if (league) {
                await populate.league(league)
                console.log("[api] league.get - get league: ", league.name)
                // return ERROR if league does not exist or is not valid
                if (!league) {
                    throw Errors.LEAGUE_NOT_FOUND
                }
            } else {
                throw Errors.LEAGUE_NOT_FOUND
            }

            // get team from league's array of team 
            let team = league.teams.find(team => team.user._id.toString() == user._id.toString() ) || null
            if (!team) {
                throw Errors.TEAM_ERROR
            }
            console.log("[api] league.get - get team: ", team.name)

            // league exists and is valid. Returning response
            let response = await leagueUtils.createLeagueResponse(user, league, team)
            metricApiSuccess("league.get", '', duration_start)
            metricApiPayloadSize("league.join", response)
            res.json(Response.resolve(response)) 
        }
        else {
            console.error(`[api] league.get - error: ${Errors.PARAMS_ERROR.status}`)
            metricApiError("league.get", Errors.PARAMS_ERROR, duration_start)
            res.status(400).send(Response.reject(Errors.PARAMS_ERROR, req.headers.language))
        }
    } catch (error) {
        console.error(`[api] league.get - error: ${error}`)
        metricApiError("league.get", error, duration_start)
        res.status(400).send(Response.reject(error, req.headers.language))
    }

}


export default get

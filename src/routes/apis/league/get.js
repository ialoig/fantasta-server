import { League, populate } from "../../../database"
import { metricApiError, metricApiPayloadSize, metricApiSuccess } from "../../../metrics"
import { Errors, leagueUtils, Response, userUtils } from "../../../utils"


const get = async (req, res, next) => {
	const duration_start = process.hrtime()
	try {

		const { leagueID } = req.query // { leagueID: '61efe018b73845071ce4e844' }
		console.log("[api] league.get - params - League ID: %s", leagueID)

		if (leagueID) {
			// get user object from token request
			const auth = await userUtils.userFromToken(req)
			const user = auth.user
			if (user) {
				await populate.user(user)
				console.log("[api] league.get - user found: ", user.username)
			} else {
				throw Errors.USER_NOT_FOUND
			}

			// find league object from db with the league id passed as params
			const league = await League.findById(leagueID).exec()
			if (league) {
				await populate.league(league)
				console.log("[api] league.get - Get League: ", league.name)
			} else {
				throw Errors.LEAGUE_NOT_FOUND
			}

			// check if user belongs to the league he's requesting for
			let leagueFound = user.leagues.find(league => league._id == leagueID) || null
			if (!leagueFound) {
				throw Errors.LEAGUE_NOT_FOUND_FOR_USER
			}
            
			// parsing league and user object to filter out sensitive information
			const parsedUser = userUtils.parseUser(user)
			const parsedLeague = leagueUtils.parseLeague(league)
			const response = {
				user: parsedUser,
				league: parsedLeague
			}

			metricApiSuccess("league.get", "", duration_start)
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

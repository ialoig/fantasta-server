import { League, populate } from "../../../database"
import { metricApiError, metricApiPayloadSize, metricApiSuccess } from "../../../metrics"
import { Errors, leagueUtils, Response, userUtils } from "../../../utils"

// eslint disabled for 'next' params - it has to be defined even if not used
// eslint-disable-next-line no-unused-vars
const join = async (req, res, next) => {
	// used to measure execution time
	const duration_start = process.hrtime()

	const { id = "", name = "", password = "", teamname = "" } = req.body

	if (id || name && password && teamname) {
		console.log("[api] league.join - params - id: %s, name: %s, password: %s, teamname: %s ", id, name, password, teamname)
		try {
			const auth = await userUtils.userFromToken(req)
			let user = auth.user
			const userId = user._id
            
			await populate.user(user)
			console.log("[api] league.join - User ID: %s, User: %s", userId, user.username)
            
			let league = await getLeague(user, id, name)

			if (!league || !league.$isValid() || league.$isEmpty()) {
				throw Errors.LEAGUE_NOT_FOUND
			}
			console.log("[api] league.join - League: ", league.name)

			let team = null

			if (id) {
				team = league.teams.find((t) => t.user._id.toString() == userId.toString()) || null
				console.log("[api] league.join - Team: ", team.name)
			}
			else if (name) {
				console.log("[api] league.join - Params name: ", name)
				if (league.participants && league.teams && league.teams.length >= league.participants) {
					throw Errors.FULL_LEAGUE
				}
				else if (league.teams.find((t) => t.user._id.toString() == userId.toString())) {
					throw Errors.USER_PRESENT_IN_LEAGUE
				}
				else if (league.teams.find((t) => t.name.toLowerCase() == teamname.toLowerCase())) {
					throw Errors.TEAM_PRESENT_IN_LEAGUE
				}
				else if (league.password != password) {
					throw Errors.WRONG_PASSWORD
				}

				team = await leagueUtils.createTeam(teamname, league.budget, userId, league._id)

				league.teams.push(team._id)
				await league.save()

				user.leagues.push(league._id)
				await user.save()
			}
			if (!team || !team.$isValid() || team.$isEmpty()) {
				throw Errors.TEAM_NOT_FOUND
			}

			let response = await leagueUtils.createLeagueResponse(user, league, team)
			console.log("[api] league.join - response: ", response)
			metricApiSuccess("league.join", "", duration_start)
			metricApiPayloadSize("league.join", response)
			res.json(Response.resolve(response))
		}
		catch (error) {
			console.error(`[api] league.join: ${error}`)
			metricApiError("league.join", error, duration_start)
			res.status(400).send(Response.reject(error, req.headers.language))
		}
	}
	else {
		console.error(`[api] league.join: ${Errors.PARAMS_ERROR.status}`)
		metricApiError("league.join", Errors.PARAMS_ERROR.status, duration_start)
		res.status(400).send(Response.reject(Errors.PARAMS_ERROR, req.headers.language))
	}
}

export default join

const getLeague = async (user, id, name) => {
	try {
		let league = null
		if (id) {
			league = user.leagues.find((l) => l._id.toString() == id) || null
		}
		else if (name) {
			league = await League.findOne({ name: name })
		}

		if (league && league.$isValid()) {
			await populate.league(league)
		}

		return league && league.$isValid() ? Promise.resolve(league) : Promise.resolve(null)
	}
	catch (error) {
		console.error(`[api] league.join -> getLeague: ${error}`)
		return Promise.reject(error)
	}
}

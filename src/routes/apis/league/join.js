import { League, populate } from '../../../database'
import { Constants, Response, leagueUtils, userUtils } from '../../../utils'
import { metricApiError, metricApiSuccess, metricApiPayloadSize } from '../../../metrics'
import * as Socket from 'socket.io'

const join = async (req, res, next) => {
    // used to measure execution time
    const duration_start = process.hrtime()

    const { id = '', name = '', password = '', teamname = '' } = req.body

    if (id || name && password && teamname) {
        try {
            const auth = await userUtils.userFromToken(req)
            let user = auth.user
            const userId = user._id

            await populate.user(user)

            let league = await getLeague(user, id, name)

            if (!league || !league.$isValid() || league.$isEmpty()) {
                throw Constants.LEAGUE_NOT_FOUND
            }

            let team = null

            if (id) {
                team = league.teams.find((t) => t.user._id.toString() == userId.toString()) || null
            }
            else if (name) {
                if (league.participants && league.teams && league.teams.length >= league.participants) {
                    throw Constants.FULL_LEAGUE
                }
                else if (league.teams.find((t) => t.user._id.toString() == userId.toString())) {
                    throw Constants.USER_TEAM_PRESENT
                }
                else if (league.teams.find((t) => t.name.toLowerCase() == teamname.toLowerCase())) {
                    throw Constants.TEAM_PRESENT
                }
                else if (league.password != password) {
                    throw Constants.WRONG_PASSWORD
                }

                team = await leagueUtils.createTeam(teamname, league.budget, userId, league._id)

                league.teams.push(team._id)
                await league.save()

                user.leagues.push(league._id)
                await user.save()
            }
            if (!team || !team.$isValid() || team.$isEmpty()) {
                throw Constants.TEAM_NOT_FOUND
            }

            let response = await leagueUtils.createLeagueResponse(user, league, team)

            //TODO: preparare socket per eventi
            // Socket.addAttendee( req, newLeag.name, '' )
            // Socket.leagueCreate( req, newLeag.name, '' )

            metricApiSuccess("league.join", '', duration_start)
            metricApiPayloadSize("league.join", response)
            res.json(Response.resolve(Constants.OK, response))
        }
        catch (error) {
            console.error(`[api] league.join: ${error}`)
            metricApiError("league.join", Constants[error] || Constants.BAD_REQUEST, duration_start)
            res.status(400).send(Response.reject(Constants.BAD_REQUEST, Constants[error] || Constants.BAD_REQUEST, error, req.headers.language))
        }
    }
    else {
        console.error(`[api] league.join: ${Constants.PARAMS_ERROR}`)
        metricApiError("league.join", Constants.PARAMS_ERROR, duration_start)
        res.status(400).send(Response.reject(Constants.BAD_REQUEST, Constants.PARAMS_ERROR, null, req.headers.language))
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

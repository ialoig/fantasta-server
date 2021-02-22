
import { League, populate } from '../../../database'
import { Constants, Response, leagueUtils, userUtils } from '../../../utils'
import { secondsFrom, METRIC_STATUS, api_duration_seconds } from "../../../metrics"

import { Socket } from '../../../socket'

const join = async ( req, res, next ) =>
{
    // used to measure execution time
    let duration_start = process.hrtime()

    const { id='', name='', password='', teamname='' } = req.body

    if ( id || name && password && teamname )
    {
        try
        {
            const auth = await userUtils.userFromToken( req )
            let user = auth.user
            const userId = user._id

            await populate.user( user )

            let league = await getLeague( user, id, name )

            if ( !league || !league.$isValid() || league.$isEmpty() )
            {
                api_duration_seconds.observe({ name: "league.join", status: METRIC_STATUS.ERROR, msg: "league_not_found"}, secondsFrom(duration_start))
                console.error('League Join: ', Constants.LEAGUE_NOT_FOUND )
                return res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.LEAGUE_NOT_FOUND, null, req.headers.language ) )
            }

            let team = null

            if ( id )
            {
                team = league.teams.find( (t) => t.user._id.toString()==userId.toString() ) || null
            }
            else if ( name )
            {
                if ( league.participants && league.teams && league.teams.length>=league.participants )
                {
                    api_duration_seconds.observe({ name: "league.join", status: METRIC_STATUS.ERROR, msg: Constants.FULL_LEAGUE}, secondsFrom(duration_start))
                    console.error('League Join: ', Constants.FULL_LEAGUE)
                    return res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.FULL_LEAGUE, null, req.headers.language ) )
                }
                else if ( league.teams.find( (t) => t.user._id.toString()==userId.toString() ) )
                {
                    api_duration_seconds.observe({ name: "league.join", status: METRIC_STATUS.ERROR, msg: Constants.USER_TEAM_PRESENT}, secondsFrom(duration_start))
                    console.error('League Join: ', Constants.USER_TEAM_PRESENT)
                    return res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.USER_TEAM_PRESENT, null, req.headers.language ) )
                }
                else if ( league.teams.find( (t) => t.name.toLowerCase()==name.toLowerCase() ) )
                {
                    api_duration_seconds.observe({ name: "league.join", status: METRIC_STATUS.ERROR, msg: Constants.TEAM_PRESENT}, secondsFrom(duration_start))
                    console.error('League Join: ', Constants.TEAM_PRESENT)
                    return res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.TEAM_PRESENT, null, req.headers.language ) )
                }
                else if ( league.password!=password )
                {
                    api_duration_seconds.observe({ name: "league.join", status: METRIC_STATUS.ERROR, msg: Constants.WRONG_PASSWORD}, secondsFrom(duration_start))
                    console.error('League Join: ', Constants.WRONG_PASSWORD)
                    return res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.WRONG_PASSWORD, null, req.headers.language ) )
                }

                team = await leagueUtils.createTeam( teamname, league.budget, userId, league._id )

                league.teams.push( team._id )
                await league.save()

                user.leagues.push( league._id )
                await user.save()
                api_duration_seconds.observe({ name: "league.join", status: METRIC_STATUS.SUCCESS, msg: ""}, secondsFrom(duration_start))
            }

            if ( !team || !team.$isValid() || team.$isEmpty() )
            {
                api_duration_seconds.observe({ name: "league.join", status: METRIC_STATUS.ERROR, msg: Constants.TEAM_NOT_FOUND}, secondsFrom(duration_start))
                console.error('League Join: ', Constants.TEAM_NOT_FOUND )
                return res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.TEAM_NOT_FOUND, null, req.headers.language ) )
            }

            let usr = await populate.user( user )
            let lg = await populate.league( league )
            let tm = await populate.team( team )

            let response = {
                user: userUtils.parseUser( usr ),
                league: leagueUtils.parseLeague( lg ),
                team: leagueUtils.parseTeam( tm ),
            }

            //TODO: preparare socket per eventi
            // Socket.addAttendee( req, newLeag.name, '' )
            // Socket.leagueCreate( req, newLeag.name, '' )

            api_duration_seconds.observe({ name: "league.join", status: METRIC_STATUS.SUCCESS, msg: ""}, secondsFrom(duration_start))
            res.json( Response.resolve(Constants.OK, response) )
        }
        catch (error)
        {
            console.error('League Join: ', error)
            return res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, error, req.headers.language ) )
        }
    }
    else
    {
        console.error('League Join: PARAMS_ERROR')
        return res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.PARAMS_ERROR, null, req.headers.language ) )
    }
}

export default join

const getLeague = async ( user, id, name ) =>
{
    try
    {
        let league = null
        if ( id )
        {
            league = user.leagues.find( (l) => l._id.toString()==id ) || null
        }
        else if ( name )
        {
            league = await League.findOne({ name: name })
        }

        if ( league && league.$isValid() )
        {
            await populate.league( league )
        }

        return league && league.$isValid() ? Promise.resolve(league) : Promise.resolve(null)
    }
    catch (error)
    {
        console.error('League Join -> getLeague: ', error)

        return Promise.reject(error)
    }
}

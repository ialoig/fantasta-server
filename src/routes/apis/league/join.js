
import { League, populate } from '../../../database'
import { Constants, Response, leagueUtils, userUtils } from '../../../utils'

import { Socket } from '../../../socket'

const join = async ( req, res, next ) =>
{
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

            if ( !league || !league.$isValid() )
            {
                throw {error: Constants.LEAGUE_NOT_FOUND}
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
                    throw {error: Constants.FULL_LEAGUE}
                }
                else if ( league.teams.find( (t) => t.user._id.toString()==userId.toString() ) )
                {
                    throw {error: Constants.USER_TEAM_PRESENT}
                }
                else if ( league.teams.find( (t) => t.name.toLowerCase()==name.toLowerCase() ) )
                {
                    throw {error: Constants.TEAM_PRESENT}
                }
                else if ( league.password!=password )
                {
                    throw {error: Constants.WRONG_PASSWORD}
                }

                team = await leagueUtils.createTeam( teamname, league.budget, userId, league._id )

                league.teams.push( team._id )
                await league.save()

                user.leagues.push( league._id )
                await user.save()
            }

            if ( !team || !team.$isValid() )
            {
                throw {error: Constants.TEAM_NOT_FOUND}
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

            res.json( Response.resolve(Constants.OK, response) )
        }
        catch (error)
        {
            console.error('League Join: ', error)
            res.status(500).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, error ) )
        }
    }
    else
    {
        console.error('League Join: PARAMS_ERROR')
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.PARAMS_ERROR, null ) )
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

        await populate.league( league )

        return league ? Promise.resolve(league) : Promise.reject(Constants.LEAGUE_NOT_FOUND)
    }
    catch (error)
    {
        console.error('League Join -> getLeague: ', error)

        return Promise.reject(error)
    }
}
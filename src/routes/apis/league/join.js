
import { League, Team, populate } from '../../../database'
import { Constants, Response, leagueUtils, userUtils } from '../../../utils'

import { Socket } from '../../../socket'

export const join = async ( req, res, next ) =>
{
    const { id='', name='', password='', teamname='' } = req.body

    let auth = await userUtils.userFromToken( req )
    
    if ( auth && id || name && password && teamname )
    {
        try
        {
            let user = auth.user
            let league = await League.findOne({ name })

            let newTeam = await Team.create({
                name: teamname,
                budget: league.budget,
                user: user._id
            })

            user.leagues.push( league )
            await user.save()

            let usr1 = await populate.user( user )
            let lg1 = await populate.league( league )
            let tm1 = await populate.team( newTeam )

            let response = {
                user: userUtils.parseUser( usr1 ),
                league: leagueUtils.parseLeague( lg1 ),
                team: leagueUtils.parseTeam( tm1 ),
            }

            //TODO: preparare socket per eventi
            // Socket.addAttendee( req, newLeag.name, '' )
            // Socket.leagueCreate( req, newLeag.name, '' )

            res.json( Response.resolve(Constants.OK, response) )
        }
        catch (error)
        {
            console.error(error)
            res.status(500).send( Response.reject( Constants.INT_SERV_ERR, Constants.INT_SERV_ERR, error ) )
        }
    }
    else
    {
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, league.error ) )
    }
}

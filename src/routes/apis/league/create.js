
import { League, Team, populate } from '../../../database'
import { Constants, Response, leagueUtils, userUtils } from '../../../utils'

import { Socket } from '../../../socket'

export const create = async ( req, res, next ) =>
{
    //todo: send metric (League.create api call)

    let leagueData = req.body || {}

    let auth = await userUtils.userFromToken( req )
    let league = leagueUtils.validateleague( leagueData )

    if ( auth && league.valid )
    {
        try
        {
            let user = auth.user

            let newTeam = await Team.create({
                name: leagueData.teamname,
                budget: leagueData.budget,
                user: user._id
            })

            let settings = league.settings
            settings.admin = user._id
            settings.teams = [ newTeam._id ]

            let newLeague = await League.create(settings)

            user.leagues.push( newLeague )
            await user.save()

            // Socket.addAttendee( req, newLeag.name, '' )
            // Socket.leagueCreate( req, newLeag.name, '' )

            let usr1 = await populate.user( user )
            let lg1 = await populate.league( newLeague )
            let tm1 = await populate.team( newTeam )

            let response = {
                user: userUtils.parseUser( usr1 ),
                league: leagueUtils.parseLeague( lg1 ),
                team: leagueUtils.parseTeam( tm1 ),
            }

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

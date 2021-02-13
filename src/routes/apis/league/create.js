
import { League, Team, populate } from '../../../database'
import { Constants, Response, leagueUtils, userUtils } from '../../../utils'

import { Socket } from '../../../socket'

export const create = async ( req, res, next ) =>
{
    //todo: send metric (League.create api call)

    try
    {
        let leagueData = req.body || {}
        let leagueSettings = leagueUtils.validateleague( leagueData )
        const teamName = leagueData.teamname

        const auth = await userUtils.userFromToken( req )
        let user = auth.user
        const userId = user._id

        let newTeam = await Team.create({
            name: teamName,
            budget: leagueSettings.budget,
            user: userId
        })
        
        leagueSettings.admin = userId
        leagueSettings.teams = [ newTeam._id ]

        let newLeague = await League.create(leagueSettings)

        newTeam.league = newLeague._id
        await newTeam.save()

        user.leagues.push( newLeague._id )
        await user.save()

        let usr1 = await populate.user( user )
        let lg1 = await populate.league( newLeague )
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
        console.error('League Create: ',error)
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, error ) )
    }
}

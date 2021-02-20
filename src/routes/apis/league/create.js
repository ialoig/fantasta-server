
import { League, populate } from '../../../database'
import { Constants, Response, leagueUtils, userUtils } from '../../../utils'

import { Socket } from '../../../socket'

const create = async ( req, res, next ) =>
{
    //todo: send metric (League.create api call)
    let leagueData = req.body || {}
    
    try
    {
        const auth = await userUtils.userFromToken( req )
        let user = auth.user
        const userId = user._id

        let leagueSettings = leagueUtils.validateleague( leagueData, userId )
        let newLeague = await League.create(leagueSettings)

        let newTeam = await leagueUtils.createTeam( leagueData.teamname, leagueSettings.budget, userId, newLeague._id )
               
        newLeague.teams = [ newTeam._id ]
        await newLeague.save()
        
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
        console.error('League Create: ', error)
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, error, req.headers.language ) )
    }
}

export default create
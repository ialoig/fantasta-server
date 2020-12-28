
import { AuctionConfig, Commons, League } from '../../../database'
import { Constants, LeagueUtils, Response } from '../../../utils'
import { Socket } from '../../../socket'

export const create = async ( req, res, next ) =>
{
    let leagueData = req.body && req.body.league || {};
    let settings = req.body && req.body.settings || {};

    var leagueValid = LeagueUtils.validateleague(leagueData, true);
    var settingsValid = LeagueUtils.validateSettings(settings)

    if ( leagueValid.valid && settingsValid.valid )
    {
        let user = null
        try
        {
            user = await verifyToken( params.token )
        }
        catch (error)
        {
            console.error(error)
            res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, error ) )
        }

        var newAuct = AuctionConfig({ user, leagueData, settings });
        var newLeag = League({ leagueData, user, newAuct });

        var leag = {
            leagueId: newLeag.id,
            leagueName: newLeag.name,
            username: leagueData.username,
            admin: true,
        };
        var newvalues = { $push: {'leagues': leag} };

        try
        {
            await Commons.update( user, newvalues )
            let newLeague = await Commons.save( newLeag )
            await Commons.save( newAuct )

            let user = await user.findById( user.id )
            
            var attendees = LeagueUtils.getleagueObj(newLeague).attendees
            var resp = {
                league: newLeague.id,
                full: false,
                attendees: attendees
            };

            Socket.addAttendee( req, newLeag.name, '' );
            Socket.leagueCreate( req, newLeag.name, '' );

            res.json( Response.resolve(Constants.OK, resp) );
        }
        catch (error)
        {
            console.error(error)
            res.status(500).send( Response.reject( Constants.INT_SERV_ERR, Constants.INT_SERV_ERR, error ) )
        }
    }
    else
    {
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, !leagueValid.valid ? leagueValid.error : settingsValid.error ) )
    }

}


import { RESPONSE } from '@pinkal/central_utilities'

import { AuctionConfig, League } from 'database'
import { Constants, LeagueUtils } from 'utils'

const get = async ( req, res, next ) =>
{
    let user = req.header('user');
    let leagueId = req.query.leagueId
    
    console.log(user);
    
    if ( leagueId )
    {
        let league = null;
        try
        {
            league = await League.findById( leagueId )
        }
        catch (error)
        {
            console.error(error)
            res.status(400).send( RESPONSE.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, error ) )
        }

        let auction = null;
        try
        {
            auction = await AuctionConfig.findById( league.auction.id )
        }
        catch (error)
        {
            console.error(error)
            res.status(400).send( RESPONSE.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, error ) )
        }
        
        let resp = {
            user: user,
            league: LeagueUtils.getleagueObj(league),
            auction: LeagueUtils.getAuctionObj(auction)
        };
        resp.user.admin = user.id==league.administrator.id;

        res.json( RESPONSE.resolve(Constants.OK, resp) );
    }
    else
    {
        res.status(400).send( RESPONSE.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, null ) )
    }

}

export default get

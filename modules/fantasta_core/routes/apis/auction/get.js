
import { RESPONSE } from '@pinkal/central_utilities'

import { default as DB } from 'database'
import { Constants, LeagueUtils } from 'utils'

// let Token = require('../../utils/token');

const get = async ( req, res, next ) =>
{
    let params = req.query;
    if ( params.leagueId && params.token )
    {
        let user = null
        try
        {
            user = await verifyToken( params.token )
        }
        catch (error)
        {
            console.error(error)
            res.status(400).send( RESPONSE.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, error ) )
        }

        let league = null;
        try
        {
            league = await DB.League.findById( params.leagueId )
        }
        catch (error)
        {
            console.error(error)
            res.status(400).send( RESPONSE.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, error ) )
        }

        let auction = null;
        try
        {
            auction = await DB.AuctionConfig.findById( league.auction.id )
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

        res.json( RESPONSE.resolve(Constants.OK, resp, params.token) );
    }
    else
    {
        res.status(400).send( RESPONSE.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, null ) )
    }

}

const verifyToken = async ( tok ) =>
{
    let token = null
    let user = null

    try
    {
        token = await Token.read( tok, req )
    }
    catch (error)
    {
        console.error(error)
        return Promise.reject(error)
    }

    try
    {
        user = await database.user.findById( token.id )
    }
    catch (error)
    {
        console.error(error)
        return Promise.reject(error)
    }

    if ( user.password && user.password==token.password )
    {
        return Promise.resolve(user)
    }
    else
    {
        return Promise.reject()
    }
}

export default get

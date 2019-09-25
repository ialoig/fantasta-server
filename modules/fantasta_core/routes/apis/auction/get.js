
let response = require('../../utils/response');

let database = require('../../database/database');
let config = require('../../utils/config');
let Token = require('../../utils/token');

let leagueUtils = require('../../utils/league/leagueFunctions');
let userUtils = require('../../utils/user/userFunctions');

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
            res.status(400).send( response.reject( config.constants.BAD_REQUEST, config.constants.BAD_REQUEST, error ) )
        }

        let league = null;
        try
        {
            league = await database.league.findById( params.leagueId )
        }
        catch (error)
        {
            console.error(error)
            res.status(400).send( response.reject( config.constants.BAD_REQUEST, config.constants.BAD_REQUEST, error ) )
        }

        let auction = null;
        try
        {
            auction = await database.auction.findById( league.auction.id )
        }
        catch (error)
        {
            console.error(error)
            res.status(400).send( response.reject( config.constants.BAD_REQUEST, config.constants.BAD_REQUEST, error ) )
        }
        
        let resp = {
            user: userUtils.getUsrObj(user),
            league: leagueUtils.getleagueObj(league),
            auction: leagueUtils.getAuctionObj(auction)
        };
        resp.user.admin = user.id==league.administrator.id;

        res.json( response.resolve(config.constants.OK, resp, params.token) );
    }
    else
    {
        res.status(400).send( response.reject( config.constants.BAD_REQUEST, config.constants.BAD_REQUEST, null ) )
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

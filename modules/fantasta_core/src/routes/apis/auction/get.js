
var response = require('../../utils/response');

var database = require('../../database/database');
var config = require('../../utils/config');
var Token = require('../../utils/token');

var leagueUtils = require('../../utils/league/leagueFunctions');
var userUtils = require('../../utils/user/userFunctions');

module.exports = function ( req, res, next )
{
    var params = req.query;
    var token = null;

    var user = null;
    var league = null;
    var auction = null;

    if ( params.leagueId && params.token )
    {
        Token.read( params.token, req )
        .then(
            function (data)
            {
                token = data;
                return database.user.findById( token.id );
            }
        )
        .then(
            function (data)
            {
                user = data;
                if ( user.password && user.password==token.password )
                {
                    return database.league.findById( params.leagueId );
                }
                else
                {
                    res.status(400).send( response.reject(config.constants.BAD_REQUEST, config.constants.WRONG_PASSWORD ) );
                }
            }
        )
        .then(
            function (data)
            {
                league = data;
                return database.auction.findById( league.auction.id );
            }
        )
        .then(
            function (data)
            {
                auction = data;
                return true;
            }
        )
        .then(
            function ()
            {
                var resp = {
                    user: userUtils.getUsrObj(user),
                    league: leagueUtils.getleagueObj(league),
                    auction: leagueUtils.getAuctionObj(auction)
                };
                resp.user.admin = user.id==league.administrator.id;

                res.json( response.resolve(config.constants.OK, resp) );
            }
        )
        .catch(
            function (error)
            {
                res.status(400).send( response.reject(config.constants.BAD_REQUEST, config.constants.BAD_REQUEST ) );
            }
        );
    }
    else
    {
        res.status(400).send( response.reject(config.constants.BAD_REQUEST, config.constants.BAD_REQUEST ) );
    }

};

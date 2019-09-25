
var response = require('../../utils/response');

var database = require('../../database/database');
var config = require('../../utils/config');
var Token = require('../../utils/token');

module.exports = function ( req, res, next )
{
    var params = req.query;
    if ( params.token && params.version )
    {
        Token.read( params.token, req )
        .then(
            function (token)
            {
                return database.players.getPlayers();
            }
        )
        .then(
            function (players)
            {
                var version = parseInt(params.version);
                var obj = {
                    version: players.version,
                    players: players.version>version ? players.players : {},
                    updated: version>=players.version
                };
                res.json( response.resolve(config.constants.OK, obj) );
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

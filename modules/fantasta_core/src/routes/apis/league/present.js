
var response = require('../../utils/response');

var database = require('../../database/database');
var config = require('../../utils/config');

module.exports = function ( req, res, next )
{
    var params = req.query;
    if ( params.name )
    {
        database.league.present( params.name )
        .then(
            function (data)
            {
                res.json( data );
            },
        );
    }
    else
    {
        res.status(400).send( response.reject(config.constants.BAD_REQUEST, config.constants.BAD_REQUEST ) );
    }

};

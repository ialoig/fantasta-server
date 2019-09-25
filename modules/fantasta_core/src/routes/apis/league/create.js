
var Q = require('q');

var database = require('../../database/database');
var response = require('../../utils/response');
var config = require('../../utils/config');
var Token = require('../../utils/token');
var socket = require('../../utils/socket');

var leagueUtils = require('../../utils/league/leagueFunctions');

module.exports = function ( req, res, next )
{
    var body = req.body;

    var leagueData = body.league || {};
    var settings = body.settings || {};
    var token = '';

    var leagueValid = leagueUtils.validateleague(leagueData, true);
    var settingsValid = leagueUtils.validateSettings(settings)

    if ( leagueValid.valid && settingsValid.valid )
    {
        Token.read( body.token, req )
        .then(
            function (data)
            {
                token = data;
                return database.user.findById( data.id );
            }
        )
        .then(
            function (user)
            {
                if ( user.password && user.password==token.password )
                {
                    var newAuct = database.auction.create( user, leagueData, settings );
                    var newLeag = database.league.create( leagueData, user, newAuct );

                    var leag = {
                        leagueId: newLeag.id,
                        leagueName: newLeag.name,
                        username: leagueData.username,
                        admin: true,
                    };
                    var newvalues = { $push: {'leagues': leag} };

                    Q.all([
                        database.db.update( user, newvalues ),
                        database.db.save( newLeag ),
                        database.db.save( newAuct )
                    ])
                    .then(
                        function (data)
                        {
                            database.user.findById( user.id )
                            .then(
                                function (user)
                                {
                                    var attendees = leagueUtils.getleagueObj(data[1]).attendees
                                    var resp = {
                                        league: data[1].id,
                                        full: false,
                                        attendees: attendees
                                    };

                                    socket.addAttendee( req, newLeag.name, '' );
                                    socket.leagueCreate( req, newLeag.name, '' );

                                    res.json( response.resolve(config.constants.OK, resp) );
                                }
                            );
                        }
                    );
                }
                else
                {
                    res.status(400).send( response.reject(config.constants.BAD_REQUEST, config.constants.WRONG_PASSWORD ) );
                }
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
        res.status(400).send( response.reject( config.constants.BAD_REQUEST, !leagueValid.valid ? leagueValid.error : settingsValid.error ) );
    }

};


var Q = require('q');

var database = require('../../database/database');
var response = require('../../utils/response');
var config = require('../../utils/config');
var Token = require('../../utils/token');
var leagueUtils = require('../../utils/league/leagueFunctions');
var socket = require('../../utils/socket');

module.exports = function ( req, res, next )
{
    var body = req.body || {};
    var leagueData = body.leagueData || {};
    var leagueValid = leagueUtils.validateleague(leagueData, false);

    if ( leagueValid.valid && body.token )
    {
        database.league.findByName( leagueData.name )
        .then(
            function (league)
            {
                if ( league.password!=leagueData.password )
                {
                    res.status(400).send( response.reject( config.constants.BAD_REQUEST, config.constants.WRONG_PASSWORD ) );
                }
                else if ( league.attendees.length>=league.total_attendees )
                {
                    res.status(400).send( response.reject( config.constants.FULL_LEAGUE, config.constants.FULL_LEAGUE ) );
                }
                else
                {
                    var auction = {};

                    database.auction.findById( league.auction.id )
                    .then(
                        function (data)
                        {
                            auction = data;

                            return Token.read( body.token, req )
                        }
                    )
                    .then(
                        function (tok)
                        {
                            return database.user.findById( tok.id );
                        }
                    )
                    .then(
                        function (user)
                        {
                            var part = {
                                name: user.name,
                                id: user.id,
                                username: leagueData.username,
                                admin: false
                            };
                            var newPart = { $push: {'attendees': part} };

                            var leag = {
                                leagueId: league.id,
                                leagueName: league.name,
                                username: leagueData.username,
                                admin: false
                            };
                            var newLeag = { $push: {'leagues': leag} };

                            var attendees = auction.attendees;
                            var teams = auction.teams;
                            attendees[user.id] = part;
                            teams[user.id] = [];
                            var newAuct = { $set: {'attendees': attendees, 'teams': teams} };

                            Q.all([
                                database.db.update( league, newPart ),
                                database.db.update( auction, newAuct ),
                                database.db.update( user, newLeag )
                            ])
                            .then(
                                function (data)
                                {
                                    Q.all([
                                        database.user.findById( user.id ),
                                        database.league.findById( league.id ),
                                        database.auction.findById( auction.id )
                                    ])
                                    .then(
                                        function (data)
                                        {
                                            var attendees = leagueUtils.getleagueObj(data[1]).attendees;
                                            var resp = {
                                                league: data[1].id,
                                                full: false,
                                                attendees: attendees
                                            };
                                            var league = data[1];
                                            if ( league.attendees.length==league.total_attendees )
                                            {
                                                resp.full = true;
                                                socket.leagueCreate( req, league.name, 'OK' );
                                            }

                                            if ( league.attendees.length<league.total_attendees )
                                            {
                                                socket.addAttendee( req, league.name, attendees );
                                            }

                                            res.json( response.resolve(config.constants.OK, resp) );
                                        }
                                    );
                                }
                            );
                        }
                    )
                    .catch(
                        function (error)
                        {
                            res.status(400).send( response.reject(config.constants.BAD_REQUEST, config.constants.BAD_REQUEST ) );
                        }
                    );
                }
            },
            function (error)
            {
                res.status(404).send( response.reject( config.constants.NOT_FOUND, config.constants.LEAGUE_NOT_FOUND ) );
            }
        );
    }
    else
    {
        res.status(400).send( response.reject( config.constants.BAD_REQUEST, leagueValid.error ) );
    }

};

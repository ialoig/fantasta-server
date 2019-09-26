
import { RESPONSE } from '@pinkal/central_utilities'

import { default as DB } from 'database'
import { Constants, LeagueUtils } from 'utils'
import { Socket } from 'socket'

var Token = require('../../utils/token');

module.exports = function ( req, res, next )
{
    var body = req.body || {};
    var leagueData = body.leagueData || {};
    var leagueValid = LeagueUtils.validateleague(leagueData, false);

    if ( leagueValid.valid && body.token )
    {
        DB.League.findByName( leagueData.name )
        .then(
            function (league)
            {
                if ( league.password!=leagueData.password )
                {
                    res.status(400).send( RESPONSE.reject( Constants.BAD_REQUEST, Constants.WRONG_PASSWORD ) );
                }
                else if ( league.attendees.length>=league.total_attendees )
                {
                    res.status(400).send( RESPONSE.reject( Constants.FULL_LEAGUE, Constants.FULL_LEAGUE ) );
                }
                else
                {
                    var auction = {};

                    DB.AuctionConfig.findById( league.auction.id )
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
                            return DB.User.findById( tok.id );
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
                                DB.commons.update( league, newPart ),
                                DB.commons.update( auction, newAuct ),
                                DB.commons.update( user, newLeag )
                            ])
                            .then(
                                function (data)
                                {
                                    Q.all([
                                        DB.user.findById( user.id ),
                                        DB.League.findById( league.id ),
                                        DB.AuctionConfig.findById( auction.id )
                                    ])
                                    .then(
                                        function (data)
                                        {
                                            var attendees = LeagueUtils.getleagueObj(data[1]).attendees;
                                            var resp = {
                                                league: data[1].id,
                                                full: false,
                                                attendees: attendees
                                            };
                                            var league = data[1];
                                            if ( league.attendees.length==league.total_attendees )
                                            {
                                                resp.full = true;
                                                Socket.leagueCreate( req, league.name, 'OK' );
                                            }

                                            if ( league.attendees.length<league.total_attendees )
                                            {
                                                Socket.addAttendee( req, league.name, attendees );
                                            }

                                            res.json( RESPONSE.resolve(Constants.OK, resp) );
                                        }
                                    );
                                }
                            );
                        }
                    )
                    .catch(
                        function (error)
                        {
                            res.status(400).send( RESPONSE.reject(Constants.BAD_REQUEST, Constants.BAD_REQUEST ) );
                        }
                    );
                }
            },
            function (error)
            {
                res.status(404).send( Response.reject( Constants.NOT_FOUND, Constants.LEAGUE_NOT_FOUND ) );
            }
        );
    }
    else
    {
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, leagueValid.error ) );
    }

};

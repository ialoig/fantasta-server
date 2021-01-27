
import { AuctionConfig, Commons, League } from '../../../database'
import { Constants, LeagueUtils, Response } from '../../../utils'
import { Socket } from '../../../socket'
import * as Token from '../../../token'

export const join = async ( req, res, next ) =>
{
    let body = req.body || {}
    const { id='', name='', password='', team='' } = body

    const token = Token.Get( req )
    
    if ( token && (id || name && password && team) )
    {
        try
        {
            let league = null

            if ( id )
            {
                league = await League.findById( id )
            }
            else if ( name )
            {
                league = await League.findOne({ name: name })

                if ( league.password!=password )
                {
                    res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.WRONG_PASSWORD ) )
                    return;
                }
                else if ( league.attendees.length>=league.total_attendees )
                {
                    res.status(400).send( Response.reject( Constants.FULL_LEAGUE, Constants.FULL_LEAGUE ) )
                    return;
                }
            }
            
            let auction = await AuctionConfig.findById( league.auction.id )
            
            let tok = await Token.read( body.token, req )

            let user = await User.findById( tok.id )
                
            let part = {
                name: user.name,
                id: user.id,
                username: leagueData.username,
                admin: false
            }
            let newPart = { $push: {'attendees': part} }

            let leag = {
                leagueId: league.id,
                leagueName: league.name,
                username: leagueData.username,
                admin: false
            }
            let newLeag = { $push: {'leagues': leag} }

            let attendees = auction.attendees
            let teams = auction.teams
            attendees[user.id] = part
            teams[user.id] = []
            let newAuct = { $set: {'attendees': attendees, 'teams': teams} }

            let data = await Promise.all([
                Commons.update( league, newPart ),
                Commons.update( auction, newAuct ),
                Commons.update( user, newLeag )
            ])

            data = await Promise.all([
                User.findById( user.id ),
                League.findById( league.id ),
                AuctionConfig.findById( auction.id )
            ])
            
            let attendees1 = LeagueUtils.getleagueObj(data[1]).attendees
            let resp = {
                league: data[1].id,
                full: false,
                attendees: attendees1
            }
            let newLeague = data[1]
            if ( newLeague.attendees.length==newLeague.total_attendees )
            {
                resp.full = true
                Socket.leagueCreate( req, newLeague.name, 'OK' )
            }

            if ( newLeague.attendees.length<newLeague.total_attendees )
            {
                Socket.addAttendee( req, newLeague.name, attendees )
            }

            res.json( Response.resolve(Constants.OK, resp) )
        }
        catch (error)
        {
            res.status(404).send( Response.reject( Constants.NOT_FOUND, Constants.LEAGUE_NOT_FOUND, error ) )
        }
    }
    else
    {
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, null ) )
    }

}

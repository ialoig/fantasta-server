
import { League } from '../../../database'
import { Constants, LeagueUtils, Response } from '../../../utils'
import { Socket } from '../../../socket'

export const join = async (req, res, next) => {
    var body = req.body || {}
    var leagueData = body.leagueData || {}
    var leagueValid = LeagueUtils.validateleague(leagueData, false)

    if (leagueValid.valid && body.token) {
        try {
            let league = await League.findByName(leagueData.name)

            if (league.password != leagueData.password) {
                res.status(400).send(Response.reject(Constants.BAD_REQUEST, Constants.WRONG_PASSWORD))
            }
            else if (league.attendees.length >= league.total_attendees) {
                res.status(400).send(Response.reject(Constants.FULL_LEAGUE, Constants.FULL_LEAGUE))
            }
            else {
                let tok = await Token.read(body.token, req)

                let user = await User.findById(tok.id)

                var part = {
                    name: user.name,
                    id: user.id,
                    username: leagueData.username,
                    admin: false
                }
                var newPart = { $push: { 'attendees': part } }

                var leag = {
                    leagueId: league.id,
                    leagueName: league.name,
                    username: leagueData.username,
                    admin: false
                }
                var newLeag = { $push: { 'leagues': leag } }

                attendees[user.id] = part
                teams[user.id] = []

                let data = await Promise.all([
                    Commons.update(league, newPart),
                    Commons.update(user, newLeag)
                ])

                data = await Promise.all([
                    User.findById(user.id),
                    League.findById(league.id),
                ])

                var attendees = LeagueUtils.getleagueObj(data[1]).attendees
                var resp = {
                    league: data[1].id,
                    full: false,
                    attendees: attendees
                }
                var newLeague = data[1]
                if (newLeague.attendees.length == newLeague.total_attendees) {
                    resp.full = true
                    Socket.leagueCreate(req, newLeague.name, 'OK')
                }

                if (newLeague.attendees.length < newLeague.total_attendees) {
                    Socket.addAttendee(req, newLeague.name, attendees)
                }

                res.json(Response.resolve(Constants.OK, resp))
            }
        }
        catch (error) {
            res.status(404).send(Response.reject(Constants.NOT_FOUND, Constants.LEAGUE_NOT_FOUND))
        }
    }
    else {
        res.status(400).send(Response.reject(Constants.BAD_REQUEST, leagueValid.error))
    }

}

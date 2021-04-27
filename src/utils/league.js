import _ from 'lodash'
import { populate, Team } from '../database'
import { Errors, userUtils } from '../utils'

const validateleague = ( leagueData ) => {
    let resp = {
        league: {},
        error: Errors.LEAGUE_ERROR,
        valid: false
    }

    if ( !leagueData || _.isEmpty(leagueData) ) {
        resp.error = Errors.LEAGUE_ERROR
    }
    else if (!leagueData.name) {
        resp.error = Errors.LEAGUE_NAME_ERROR
    }
    else if (!leagueData.password) {
        resp.error = Errors.LEAGUE_PASSWORD_ERROR
    }
    else if (!leagueData.teamname) {
        resp.error = Errors.TEAM_ERROR
    }
    else if (!["alphabetic", "call", "random"].includes(leagueData.auctionType)) {
        resp.error = Errors.AUCTION_TYPE_ERROR
    }
    else if (!["zero", "listPrice"].includes(leagueData.startPrice)) {
        resp.error = Errors.START_PRICE_ERROR
    }
    else if (parseInt(leagueData.participants) < 2) {
        resp.error = Errors.ATTENDEES_ERROR
    }
    else if (!["mantra", "classic"].includes(leagueData.type)) {
        resp.error = Errors.LEAGUE_TYPE_ERROR
    }
    else if (parseInt(leagueData.goalkeepers) < 1) {
        resp.error = Errors.GOALKEEPERS_NUMBER_ERROR
    }
    else if (leagueData.type == "classic" && parseInt(leagueData.defenders) < 3) {
        resp.error = Errors.DEFENDERS_NUMBER_ERROR
    }
    else if (leagueData.type == "classic" && parseInt(leagueData.midfielders) < 3) {
        resp.error = Errors.MIDFIELDERS_NUMBER_ERROR
    }
    else if (leagueData.type == "classic" && parseInt(leagueData.strikers) < 1) {
        resp.error = Errors.STRIKERS_NUMBER_ERROR
    }
    else if (leagueData.type == "classic" && (parseInt(leagueData.defenders) + parseInt(leagueData.midfielders) + parseInt(leagueData.strikers)) < 10) {
        resp.error = Errors.PLAYERS_NUMBER_ERROR
    }
    else if (leagueData.type == "mantra" && parseInt(leagueData.players) < 10) {
        resp.error = Errors.PLAYERS_NUMBER_ERROR
    }
    else if (parseInt(leagueData.budget) < 11) {
        resp.error = Errors.BUDGET_ERROR
    }
    else if (parseInt(leagueData.countdown) < 3) {
        resp.error = Errors.COUNTDOWN_ERROR
    }
    else {
        resp.valid = true

        resp.league = {
            name: _.toString(leagueData.name),
            password: _.toString(leagueData.password),
            auctionType: leagueData.auctionType,
            startPrice: leagueData.startPrice,
            participants: parseInt(leagueData.participants),
            type: leagueData.type,
            goalkeepers: parseInt(leagueData.goalkeepers),
            defenders: leagueData.type == "classic" ? parseInt(leagueData.defenders) : 0,
            midfielders: leagueData.type == "classic" ? parseInt(leagueData.midfielders) : 0,
            strikers: leagueData.type == "classic" ? parseInt(leagueData.strikers) : 0,
            players: leagueData.type == "mantra" ? parseInt(leagueData.players) : 0,
            budget: parseInt(leagueData.budget),
            countdown: parseInt(leagueData.countdown),
            status: 'new',
            isDeleted: false
        }
    }

    return resp
}

const parseLeague = (league) => {
    let leag = {
        _id: league._id,
        admin: {
            _id: league.admin._id,
            name: league.admin.username
        },
        auctionType: league.auctionType,
        type: league.type,
        budget: league.budget,
        countdown: league.countdown,
        createdAt: league.createdAt.toISOString(),
        updatedAt: league.updatedAt.toISOString(),
        defenders: league.defenders,
        goalkeepers: league.goalkeepers,
        midfielders: league.midfielders,
        name: league.name,
        participants: league.participants,
        password: league.password,
        players: league.players,
        startPrice: league.startPrice,
        strikers: league.strikers,
        teams: []
    }

    for (let i = 0; i < league.teams.length; i++) {
        leag.teams.push(parseTeam(league.teams[i]))
    }

    return leag
}

const createTeam = async (teamName, budget, userId, leagueId) => {
    try {
        let team = await Team.create({
            name: teamName,
            budget: budget,
            user: userId,
            league: leagueId
        })

        return Promise.resolve(team)
    }
    catch (error) {
        return Promise.reject(error)
    }
}

const parseTeam = (team) => {
    let tm = {
        _id: team._id,
        budget: team.budget,
        name: team.name,
        budget: team.budget,
        createdAt: team.createdAt.toISOString(),
        updatedAt: team.updatedAt.toISOString(),
        footballPlayers: [],
        user: {
            _id: team.user._id,
            name: team.user.username
        }
    }

    return tm
}

const createLeagueResponse = async (user, league, team) => {
    let usr1 = await populate.user(user)
    let lg1 = await populate.league(league)
    let tm1 = await populate.team(team)

    let response = {
        user: userUtils.parseUser(usr1),
        league: parseLeague(lg1),
        team: parseTeam(tm1),
    }

    return Promise.resolve(response)
}

export default {
    validateleague,
    parseLeague,
    createTeam,
    parseTeam,
    createLeagueResponse
}

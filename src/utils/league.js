import _ from 'lodash'
import { populate, Team } from '../database'
import { Errors, userUtils } from '../utils'

const errors = {
    LEAGUE_NAME_ERROR: 'LEAGUE_NAME_ERROR',
    TEAM_ERROR: 'TEAM_ERROR',
    LEAGUE_PASSWORD_ERROR: 'LEAGUE_PASSWORD_EMPTY',
    ATTENDEES_ERROR: 'ATTENDEES_ERROR',
    PLAYERS_NUMBER_ERROR: 'PLAYERS_NUMBER_ERROR',
    START_PRICE_ERROR: 'START_PRICE_ERROR',
    AUCTION_TYPE_ERROR: 'AUCTION_TYPE_ERROR',
    BUDGET_ERROR: 'BUDGET_ERROR',
    COUNTDOWN_ERROR: 'COUNTDOWN_ERROR',
    LEAGUE_TYPE_ERROR: 'LEAGUE_TYPE_ERROR'
}

const validateleague = (leagueData, userID) => {
    let error = ''

    if (!leagueData.name) {
        error = errors.LEAGUE_NAME_ERROR
    }
    else if (!leagueData.password) {
        error = errors.LEAGUE_PASSWORD_ERROR
    }
    else if (!leagueData.teamname) {
        error = errors.TEAM_ERROR
    }
    else if (!["alphabetic", "call", "random"].includes(leagueData.auctionType)) {
        error = errors.AUCTION_TYPE_ERROR
    }
    else if (!["zero", "listPrice"].includes(leagueData.startPrice)) {
        error = errors.START_PRICE_ERROR
    }
    else if (parseInt(leagueData.participants) < 2) {
        error = errors.ATTENDEES_ERROR
    }
    else if (!["mantra", "classic"].includes(leagueData.type)) {
        error = errors.LEAGUE_TYPE_ERROR
    }
    else if (parseInt(leagueData.goalkeepers) < 1) {
        error = errors.PLAYERS_NUMBER_ERROR
    }
    else if (leagueData.type == "classic" && parseInt(leagueData.defenders) < 3) {
        error = errors.PLAYERS_NUMBER_ERROR
    }
    else if (leagueData.type == "classic" && parseInt(leagueData.midfielders) < 3) {
        error = errors.PLAYERS_NUMBER_ERROR
    }
    else if (leagueData.type == "classic" && parseInt(leagueData.strikers) < 1) {
        error = errors.PLAYERS_NUMBER_ERROR
    }
    else if (leagueData.type == "classic" && (parseInt(leagueData.defenders) + parseInt(leagueData.midfielders) + parseInt(leagueData.strikers)) < 10) {
        error = errors.PLAYERS_NUMBER_ERROR
    }
    else if (leagueData.type == "mantra" && parseInt(leagueData.players) < 10) {
        error = errors.PLAYERS_NUMBER_ERROR
    }
    else if (parseInt(leagueData.budget) < 11) {
        error = errors.BUDGET_ERROR
    }
    else if (parseInt(leagueData.countdown) < 3) {
        error = errors.COUNTDOWN_ERROR
    }
    else {
        return {
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
            admin: userID
        }
    }
    console.log(`[validateleague] error: ${error}`)
    throw Errors.PARAMS_ERROR // todo: perche' non throw error? non ci stampa l'errore corretto nella catch perche' fa un throw di object
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

import _ from "lodash"
import { Market, populate, Team } from "../database"
import { Errors, userUtils } from "../utils"

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
			status: "new",
			isDeleted: false
		}
	}

	return resp
}

const parseLeague = (league) => {
	let leag = {
		_id: league._id.toString(),
		name: league.name,
		password: league.password,
		admin: {
			_id: league.admin._id.toString(),
			name: league.admin.username
		},
		participants: league.participants,
		type: league.type,
		goalkeepers: league.goalkeepers,
		defenders: league.defenders,
		midfielders: league.midfielders,
		strikers: league.strikers,
		players: league.players,
		budget: league.budget,
		countdown: league.countdown,
		auctionType: league.auctionType,
		startPrice: league.startPrice,
		teams: [],
		// TODO: status
		// TODO: isDeleted
		// TODO: footballPlayers
		// market: [], // we pass the last created market as a separate object
		createdAt: league.createdAt.toISOString(),
		updatedAt: league.updatedAt.toISOString()
	}

	// populate 'teams' field
	for (let i = 0; i < league.teams.length; i++) {
		leag.teams.push(parseTeam(league.teams[i]))
	}
    
	// populate 'market' field
	// for (let i = 0; i < league.market.length; i++) {
	//     leag.teams.push(parseMarket(league.market[i]))
	// }

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
		_id: team._id.toString(),
		budget: team.budget,
		name: team.name,
		createdAt: team.createdAt.toISOString(),
		updatedAt: team.updatedAt.toISOString(),
		footballPlayers: [],
		user: {
			_id: team.user._id.toString(),
			name: team.user.username
		}
	}

	return tm
}

const parseMarket = (market) => {

	if (market == null){
		return null
	}

	let mk = {
		_id: market._id.toString(),
		league_id: market.leagueId.toString(),
		open: market.closedAt == null ? true : false,
		active: market.active,
		onlineTeams: [],
		teamTurn: market.teamTurn ? market.teamTurn._id.toString(): null,
		betHistory: market.betHistory,
		closedAt: market.closedAt ? market.closedAt.toISOString() : null,
		createdAt: market.createdAt.toISOString(),
		updatedAt: market.updatedAt.toISOString(),
	}

	// populate 'onlineTeams' field
	for (let i = 0; i < market.onlineTeams.length; i++) {
		mk.onlineTeams.push(market.onlineTeams[i]._id.toString())
	}

	/*
    // populate 'betHistory' field
    for (let i = 0; i < market.betHistory.length; i++) {
        const betHistoryFootballPlayerRaw = market.betHistory[i]

        let betHistoryFootballPlayer = {
            footballPlayerId: betHistoryFootballPlayerRaw.footballPlayerId,
            bets: []
        }
        // populate 'betHistoryFootballPlayer.bets' field
        for (let j = 0; j < betHistoryFootballPlayerRaw.bets.length; j++) {
            const singleBetFootballPlayer = {
                teamId: betHistoryFootballPlayerRaw.bets[j].teamId.toString(),
                value: betHistoryFootballPlayerRaw.bets[j].value
            }
            betHistoryFootballPlayer.bets.push(singleBetFootballPlayer)
        }
        betHistory.push(betHistoryFootballPlayer)
    }
    */

	return mk
}

/**
 * 
 * @param {*} league 
 * @returns the latest market object in the league.market array if it is not closed. null otherwise
 */
const getLatestMarket = async (league) => {
	const leagueMarkets = league.market
	if(leagueMarkets.length == 0){
		return Promise.resolve(null)
	}

	try {
		const marketObject = await Market.findById({ _id: leagueMarkets[leagueMarkets.length - 1] })
		return marketObject && marketObject.$isValid() && marketObject.closedAt == null ? Promise.resolve(marketObject) : Promise.resolve(null)
	}
	catch (error) {
		console.error(`[getLatestMarket] error: ${error}`)
		return Promise.reject(error)
	}
}


const createLeagueResponse = async (user, league, team) => {
	let usr1 = await populate.user(user)
	let lg1 = await populate.league(league)
	let tm1 = await populate.team(team)
	const mk1 = await getLatestMarket(league)

	let response = {
		user: userUtils.parseUser(usr1),
		league: parseLeague(lg1),
		team: parseTeam(tm1),
		market: parseMarket(mk1)
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

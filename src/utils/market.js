import { League, Market, populate } from "../database"
import { shuffle, sortInAlphabeticOrder } from "../socket/common"
import { AUCTION_TYPE, Errors } from "./constants"




/**
 * Object from db: 
 *  active: false,
 *  onlineTeams: [],
 *  teamTurn: [],
 *  closedAt: null,
 *  _id: 623da48f4565a80626841c6a,
 *  leagueId: 623da45e4565a80626841c2c,
 *  betHistory: [],
 *  createdAt: 2022-03-25T11:16:31.621Z,
 *  updatedAt: 2022-03-25T11:16:31.621Z,
 *  __v: 0
 * 
 * Create a new Market object on database
 * 
 * @param {String} league_id League ID
 * @returns Market object created
 */
export const createMarketObject = async (league_id) => {
	console.log(`[createMarketObject] league_id=${league_id}`)

	try {

		const league = await League.findById({ _id: league_id })

		if (!league || !league.$isValid() || league.$isEmpty()) {
			// TODO: send ERROR event and manage failure
			return Promise.reject(Errors.LEAGUE_NOT_FOUND)
		}
		else {
			// create market in DB
			let marketObj = { leagueId: league_id }
			let market = await Market.create(marketObj)
      
			// add market to league in DB
			league.market.push(market._id)
			await league.save()

			console.log("[createMarketObject] market object created in db:", market)

			return Promise.resolve(market)
		}
	}
	catch (error) {
		// TODO: send ERROR event and manage failure
		return Promise.reject(error)
	}
}



/**
 * Set Market as active for the given League ID 
 * 
 * @param {String} league_id League ID 
 * @returns the updated Market object 
 */
export const setMarketActive = async (league_id) => {
	try {
		const market = await getMarketFromLeagueID(league_id)
		if (market) {
			// set flag market active
			market.active = true
			await market.save()

			console.log("[setMarketActive] Market set to active:", market.active)
			return Promise.resolve(market)
		}
	} catch (error) {
		// TODO: send ERROR event and manage failure
		console.log("[setMarketActive] ERROR: %s", error)
		return Promise.reject(error)
	}
}

/**
 * Set the flag market.teamTurn with the given value 'teamTurn' for the given Market object
 * 
 * @param {Object} market the Market object from db
 * @param {Array} teamTurn Array of Teams ID
 * @returns the updated Market object 
 */
export const setMarketTeamTurn = async (market, teamTurn) => {
	try {
		if (market) {
			console.log("[setMarketTeamTurn] Market to update:", market._id)
			console.log("[setMarketTeamTurn] Team turn to save:", teamTurn)
			// set array of teamTurn
			market.teamTurn = teamTurn
			await market.save()

			console.log("[setMarketTeamTurn] Team turn saved!")
			return Promise.resolve(market)
		}
	} catch (error) {
		// TODO: send ERROR event and manage failure
		console.log("[setMarketTeamTurn] ERROR: %s", error)
		return Promise.reject(error)
	}
}


const getMarketFromLeagueID = async (league_id) => {
	try {
		console.log(`[getMarketFromLeagueID] Looking for a Market with league_id: ${league_id}`)

		// find market object in db with leagueId and not closed
		const filter = { leagueId: league_id, closetAt: null }
		// sort in descending order
		const sortBy = { createdAt: "desc" }
		const market = await Market.findOne(filter).sort(sortBy)
        
		if (!market) {
			console.log("[getMarketFromLeagueID] Market not found")
			// TODO: send ERROR event and manage failure
			return Promise.reject(Errors.MARKET_NOT_FOUND)
		}
		console.log("[getMarketFromLeagueID] Market from db found:", market._id)
		return Promise.resolve(market)
		
	} catch (error) {
		// TODO: send ERROR event and manage failure
		console.log("[getMarketFromLeagueID] ERROR: %s", error)
		return Promise.reject(error)
	}
}


/**
 * Create an array of Teams ID sorted by the auction type of the League found from the given League ID
 * 
 * @param {String} league_id League ID to found
 * @returns Array of Teams ID
 */
export const getTeamTurn = async (league_id) => {

	// store Teams ID to save inside market.teamsTurn field
	let teamsTurn = []
	
	// get the League from db
	let league = await League.findById({ _id: league_id })
	if (league) {
		console.log("[getTeamTurn] League found from db: %s", league.name)
		// need to populate League object to get Teams as a complete object
		league = await populate.league(league)

		const teams = league.teams
		console.log("[getTeamTurn] Teams found are: %s", teams.length)

		// get auction type to define which order use
		const auctionType = league.auctionType // random | call | alphabetic
		console.log("[getTeamTurn] Sorting teams as auction type: %s", auctionType)
		// case 0: random order
		if (auctionType === AUCTION_TYPE.RANDOM) {
			teamsTurn = shuffle(teams).map(team => team._id)
		}
		// case 1: alphabetic order
		else if (auctionType === AUCTION_TYPE.ALPHABETIC) {
			teamsTurn = teams.sort(sortInAlphabeticOrder).map(team => team._id)
		}
		// case 2: call
		else if (auctionType === AUCTION_TYPE.CALL) {
			//TODO: how can we manage call auction type ?
		}

		console.log("[getTeamTurn] Teams are sorted!")
		return teamsTurn
	}
	console.log("[getTeamTurn] League not found and Team not sorted. Returning null")
	return teamsTurn
}
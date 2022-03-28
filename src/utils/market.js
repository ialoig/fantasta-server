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

			// find if exists other open markets with the same league id
			const openMarket = await getMarketFromLeagueID(league_id)
			if (!openMarket) {
				// create market in DB
				let marketObj = { leagueId: league_id }
				let market = await Market.create(marketObj)

				// add market to league in DB
				league.market.push(market._id)
				await league.save()
	
				console.log("[createMarketObject] market object created in db:", market)
	
				return Promise.resolve(market)
			} else {
				return Promise.reject(Errors.MARKET_ALREADY_OPEN)
			}
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
		} else {
			return Promise.reject(Errors.MARKET_NOT_FOUND)
		}
	} catch (error) {
		// TODO: send ERROR event and manage failure
		console.log("[setMarketActive] ERROR: %s", error)
		return Promise.reject(error)
	}
}

/**
 * Set the flag market.teamOrder with the given value 'teamOrder' for the given Market object
 * 
 * @param {Object} market the Market object from db
 * @param {Array} teamTurn Array of Teams ID
 * @returns the updated Market object 
 */
export const setMarketTeamOrder = async (market, teamOrder) => {
	try {
		if (market) {
			console.log("[setMarketTeamTurn] Market to update:", market._id)
			console.log("[setMarketTeamTurn] Team order to save:", teamOrder)
			// set array of teamOrder
			market.teamOrder = teamOrder
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
		const market = await Market.findOne(filter)

		console.log("[getMarketFromLeagueID] Market from db found:", market == null ? null : market._id)
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
export const getTeamOrder = async (league_id) => {

	// store Teams ID to save inside market.teamsTurn field
	let teamOrder = []
	
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
		if (auctionType === AUCTION_TYPE.CALL) {
			console.log("[getTeamTurn] Sorting teams as auction type: %s", auctionType)
			teamOrder = shuffle(teams).map(team => {
				return { 
					team_id: team._id
				}
			})
			console.log("[getTeamTurn] Teams are sorted!")
		}
	} else {
		console.log("[getTeamTurn] League not found and Team not sorted. Returning null")
	}
	return teamOrder
}
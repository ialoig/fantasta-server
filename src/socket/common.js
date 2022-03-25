export const EVENT_TYPE = {

	// FootballPlayer
	SERVER_FOOTBALL_PLAYER_LIST_UPDATE: 0,

	// Events sent by the mobile app (1XX)
	CLIENT: {
		LEAGUE: {
			USER_NEW: 101,
			USER_DELETED: 102,
			USER_ONLINE: 103,
			USER_OFFLINE: 104,
			MARKET_OPEN: 105
		},
		MARKET: {
			USER_ONLINE: 106,
			ACTIVE: 107,
			FOOTBALL_PLAYER_SELECTED: 108,
			BET: 109,
			WIN: 110,
			PAUSE: 111,
			CLOSE: 112,
			USER_OFFLINE: 113,
		}
	},

	// Events sent by the server (2XX)
	SERVER: {
		LEAGUE: {
			USER_NEW: 201,
			USER_DELETED: 202,
			USER_ONLINE: 203,
			USER_OFFLINE: 204,
			MARKET_OPEN: 205
		},
		MARKET: {
			USER_ONLINE: 206,
			ACTIVE: 207,
			FOOTBALL_PLAYER_SELECTED: 208,
			BET: 209,
			WIN: 210,
			PAUSE: 211,
			CLOSE: 212,
			USER_OFFLINE: 213,
			SEARCH: 214
		}
	}
}

export const league_prefix = "league="
export const market_prefix = "market="

export function isLeagueRoom(room){
	return room.startsWith(league_prefix)
}

export function isMarketRoom(room){
	return room.startsWith(market_prefix)
}

export function getMarketRoom(league_room){
	return league_room.replace(league_prefix, market_prefix)
}

export async function getSocketsInRoom(io, room) {
	return io.in(room).fetchSockets()
}

export function extractTeamId(socket_list, exclude_socket = null) {
	return socket_list
		.filter(socket => socket !== exclude_socket)
		.map(socket => ({ team_id: socket.team_id }))
}

/**
 * Create an array of shuffled values using the Fisher-Yates algorithm
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 * 
 * Based on js solution found here : 
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * 
 * @param {Array} array Array of object
 * @returns The new shuffled array
 */
export const shuffle = (array) => {
	let currentIndex = array.length,  randomIndex

	// While there remain elements to shuffle...
	while (currentIndex != 0) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
	}
	return array
}


/**
 * Reorder an array of Teams in alphabetical order
 * 
 * @param {Array A} teamA First array to compare
 * @param {Array B} teamB Second array to compare
 * @returns 
 */
export const sortInAlphabeticOrder = (teamA, teamB) => {
	const teamNameA = teamA.name.toLowerCase()
	const teamNameB = teamB.name.toLowerCase()
	if (teamNameA < teamNameB) {
		return -1 // sort a before b
	} else if (teamNameA > teamNameB) {
		return 1 // sort b before a
	} 
	return 0
}
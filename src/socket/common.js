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
			START: 107,
			PLAYER_SELECTED: 108,
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
			START: 207,
			PLAYER_SELECTED: 208,
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

export function getPlayerTurn(player_list){
	// TODO: this is only random. handle turn rotation
	const random_index = Math.floor(Math.random() * player_list.length)
	return { turn: player_list[random_index] }
}
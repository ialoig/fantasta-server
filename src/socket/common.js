export const NAMESPACE = {
	LEAGUE: "/socket/league",
	MARKET: "/socket/market"
}

export const EVENT_TYPE = {

	// FootballPlayer
	SERVER_FOOTBALL_PLAYER_LIST_UPDATE: 0,

	// Events sent by the mobile app (1XX)
	CLIENT: {
		LEAGUE: {
			USER_NEW: 101,
			USER_DELETED: 102,
			USER_ONLINE: 103,
			USER_OFFLINE: 104
		},
		MARKET: {
			OPEN: 105,
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
			USER_OFFLINE: 204
		},
		MARKET: {
			OPEN: 205,
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


export class Message {
	constructor(event_type, data) {
		this.event_type = event_type;
		this.data = data;
	}
}


export async function getSocketsInRoom(io, room) {
	return io.in(room).fetchSockets()
}


export function extractPlayersNames(socket_list, exclude_socket = null) {
	return socket_list
		.filter(socket => socket !== exclude_socket)
		.map(socket => socket.player)
}
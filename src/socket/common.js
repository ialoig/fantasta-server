export const NAMESPACE = {
  LEAGUE: "/socket/league",
  MARKET: "/socket/market"
}

export const EVENT_TYPE = {

	// FootballPlayer
	SERVER_FOOTBALL_PLAYER_LIST_UPDATE:0,
  
	// Events sent by the mobile app
	CLIENT: {
		LEAGUE: {
			USER_NEW: 0,
			USER_EXIT: 0,
			USER_ONLINE:0,
			USER_OFFLINE:0
	  },
		MARKET: {
			OPEN: 0,
			USER_ONLINE: 0,
			START: 0,
			PLAYER_SELECTED: 0,
			BET: 0,
			WIN: 0,
			PAUSE: 0,
			CLOSE: 0,
			USER_OFFLINE: 0,
		}
	},
	
	// Events sent by the server
	SERVER: {
		LEAGUE: {
			USER_NEW: 0,
			USER_EXIT: 0,
			USER_ONLINE: 0,
			USER_OFFLINE: 0
		},
		MARKET: {
			OPEN: 0,
			USER_ONLINE: 0,
			START: 0,
			SEARCH: 0,
			PLAYER_SELECTED: 0,
			BET: 0,
			WIN: 0,
			PAUSE: 0,
			CLOSE: 0,
			USER_OFFLINE: 0,
		}
	}
}


export class Message {
  constructor(event_type, data) {
      this.event_type = event_type;
      this.data = data;
  }
}

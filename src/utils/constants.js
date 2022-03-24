
const Errors = {
	INT_SERV_ERR: {
		status: "INT_SERV_ERR",
		code: 700,
		info: {
			title: "internal_server_error",
			message: "something_went_wrong"
		}
	},
	TOKEN_NOT_VALID: {
		status: "TOKEN_NOT_VALID",
		code: 701,
		info: {
			title: "authentication_failed",
			message: "change_credentials"
		}
	},
	PARAMS_ERROR: {
		status: "PARAMS_ERROR",
		code: 710,
		info: {
			title: "params_error",
			message: "params_not_correct"
		}
	},
	EMAIL_ERROR: {
		status: "EMAIL_ERROR",
		code: 711,
		info: {
			title: "email_error",
			message: "email_not_correct"
		}
	},
	PASSWORD_ERROR: {
		status: "PASSWORD_ERROR",
		code: 712,
		info: {
			title: "password_error",
			message: "password_not_correct"
		}
	},
	EMAIL_PASSWORD_ERROR: {
		status: "EMAIL_PASSWORD_ERROR",
		code: 713,
		info: {
			title: "login_error",
			message: "email_and_or_password_error"
		}
	},
	USER_NOT_FOUND: {
		status: "USER_NOT_FOUND",
		code: 721,
		info: {
			title: "user_not_found",
			message: "change_user"
		}
	},
	EMAIL_NOT_FOUND: {
		status: "EMAIL_NOT_FOUND",
		code: 722,
		info: {
			title: "email_not_found",
			message: "change_email"
		}
	},
	IMAGE_NOT_FOUND: {
		status: "IMAGE_NOT_FOUND",
		code: 723,
		info: {
			title: "image_not_found",
			message: "change_email"
		}
	},
	WRONG_PASSWORD: {
		status: "WRONG_PASSWORD",
		code: 731,
		info: {
			title: "wrong_password",
			message: "password_not_correct"
		}
	},
	WRONG_EMAIL: {
		status: "WRONG_EMAIL",
		code: 731,
		info: {
			title: "wrong_password",
			message: "password_not_correct"
		}
	},
	EMAIL_ALREADY_EXISTS: {
		status: "EMAIL_ALREADY_EXISTS",
		code: 740,
		info: {
			title: "email_already_exists",
			message: "change_email"
		}
	},
	LEAGUE_ALREADY_EXISTS: {
		status: "LEAGUE_ALREADY_EXISTS",
		code: 761,
		info: {
			title: "league_already_exists",
			message: "change_league_name"
		}
	},
	LEAGUE_NOT_FOUND: {
		status: "LEAGUE_NOT_FOUND",
		code: 762,
		info: {
			title: "league_not_found",
			message: "try_change_leaguename"
		}
	},
	USER_PRESENT_IN_LEAGUE: {
		status: "USER_PRESENT_IN_LEAGUE",
		code: 763,
		info: {
			title: "user_already_present_in_league",
			message: "join_league_from_home"
		}
	},
	TEAM_PRESENT_IN_LEAGUE: {
		status: "TEAM_PRESENT_IN_LEAGUE",
		code: 764,
		info: {
			title: "team_already_present_in_league",
			message: "change_team_name"
		}
	},
	FULL_LEAGUE: {
		status: "FULL_LEAGUE",
		code: 765,
		info: {
			title: "league_full",
			message: "cannot_join_league"
		}
	},
	LEAGUE_NOT_FOUND_FOR_USER: {
		status: "LEAGUE_NOT_FOUND_FOR_USER",
		code: 766,
		info: {
			title: "league_not_found_for_user",
			message: "league_not_found_for_user"
		}
	},
	LEAGUE_ERROR: {
		status: "LEAGUE_ERROR",
		code: 800,
		info: {
			title: "LEAGUE_ERROR",
			message: "LEAGUE_ERROR"
		}
	},
	LEAGUE_NAME_ERROR: {
		status: "LEAGUE_NAME_ERROR",
		code: 801,
		info: {
			title: "league_name_error",
			message: "league_name_error"
		}
	},
	LEAGUE_PASSWORD_ERROR: {
		status: "LEAGUE_PASSWORD_ERROR",
		code: 802,
		info: {
			title: "LEAGUE_PASSWORD_ERROR",
			message: "LEAGUE_PASSWORD_ERROR"
		}
	},
	TEAM_ERROR: {
		status: "TEAM_ERROR",
		code: 803,
		info: {
			title: "TEAM_ERROR",
			message: "TEAM_ERROR"
		}
	},
	AUCTION_TYPE_ERROR: {
		status: "AUCTION_TYPE_ERROR",
		code: 804,
		info: {
			title: "AUCTION_TYPE_ERROR",
			message: "AUCTION_TYPE_ERROR"
		}
	},
	START_PRICE_ERROR: {
		status: "FULLSTART_PRICE_ERROR_LEAGUE",
		code: 805,
		info: {
			title: "START_PRICE_ERROR",
			message: "START_PRICE_ERROR"
		}
	},
	ATTENDEES_ERROR: {
		status: "ATTENDEES_ERROR",
		code: 806,
		info: {
			title: "ATTENDEES_ERROR",
			message: "ATTENDEES_ERROR"
		}
	},
	LEAGUE_TYPE_ERROR: {
		status: "LEAGUE_TYPE_ERROR",
		code: 807,
		info: {
			title: "LEAGUE_TYPE_ERROR",
			message: "LEAGUE_TYPE_ERROR"
		}
	},
	GOALKEEPERS_NUMBER_ERROR: {
		status: "GOALKEEPERS_NUMBER_ERROR",
		code: 808,
		info: {
			title: "GOALKEEPERS_NUMBER_ERROR",
			message: "GOALKEEPERS_NUMBER_ERROR"
		}
	},
	DEFENDERS_NUMBER_ERROR: {
		status: "DEFENDERS_NUMBER_ERROR",
		code: 809,
		info: {
			title: "DEFENDERS_NUMBER_ERROR",
			message: "DEFENDERS_NUMBER_ERROR"
		}
	},
	MIDFIELDERS_NUMBER_ERROR: {
		status: "MIDFIELDERS_NUMBER_ERROR",
		code: 810,
		info: {
			title: "MIDFIELDERS_NUMBER_ERROR",
			message: "MIDFIELDERS_NUMBER_ERROR"
		}
	},
	STRIKERS_NUMBER_ERROR: {
		status: "STRIKERS_NUMBER_ERROR",
		code: 811,
		info: {
			title: "STRIKERS_NUMBER_ERROR",
			message: "STRIKERS_NUMBER_ERROR"
		}
	},
	PLAYERS_NUMBER_ERROR: {
		status: "PLAYERS_NUMBER_ERROR",
		code: 812,
		info: {
			title: "PLAYERS_NUMBER_ERROR",
			message: "PLAYERS_NUMBER_ERROR"
		}
	},
	BUDGET_ERROR: {
		status: "BUDGET_ERROR",
		code: 813,
		info: {
			title: "BUDGET_ERROR",
			message: "BUDGET_ERROR"
		}
	},
	COUNTDOWN_ERROR: {
		status: "COUNTDOWN_ERROR",
		code: 814,
		info: {
			title: "COUNTDOWN_ERROR",
			message: "COUNTDOWN_ERROR"
		}
	},
	RESET_EXPIRED: {
		status: "RESET_EXPIRED",
		code: 815,
		info: {
			title: "reset_expired",
			message: "reset_expired_msg"
		}
	},
	MARKET_NOT_FOUND: {
		status: "MARKET_NOT_FOUND",
		code: 816,
		info: {
			title: "market_not_found",
			message: "market_not_found_msg"
		}
	},
}

const PASSWORD_OPT = {
	minLength: 6,
	minLowercase: 0,
	minUppercase: 0,
	minNumbers: 0,
	minSymbols: 0,
	returnScore: false,
	pointsPerUnique: 1,
	pointsPerRepeat: 0.5,
	pointsForContainingLower: 10,
	pointsForContainingUpper: 10,
	pointsForContainingNumber: 10,
	pointsForContainingSymbol: 10
}



const AUCTION_TYPE = {
	RANDOM: "random",
	CALL: "call",
	ALPHABETIC: "alphabetic"
}

export {
	Errors,
	PASSWORD_OPT,
	AUCTION_TYPE
}
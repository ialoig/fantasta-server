
const Errors = {

    INT_SERV_ERR: {
        status: "INT_SERV_ERR",
        cose: 701,
        info: {
            title: 'internal_server_error',
            message: 'something_went_wrong'
        }
    },

    PARAMS_ERROR: {
        status: "PARAMS_ERROR",
        code: 702,
        info: {
            title: 'params_error',
            message: 'params_not_correct'
        }
    },

    EMAIL_NOT_FOUND: {
        status: "EMAIL_NOT_FOUND",
        cose: 700,
        info: {
            title: 'email_not_found',
            message: 'change_email'
        }
    },

    WRONG_PASSWORD: {
        status: "WRONG_PASSWORD",
        cose: 700,
        info: {
            title: 'wrong_password',
            message: 'try_change_password'
        }
    },

    TOKEN_NOT_VALID: {
        status: "TOKEN_NOT_VALID",
        code: 700,
        info: {
            title: 'authentication_failed',
            message: 'change_credentials'
        }
    },

    USER_NOT_FOUND: {
        status: "USER_NOT_FOUND",
        cose: 700,
        info: {
            title: 'user_not_found',
            message: 'try_change_email'
        }
    },

    EMAIL_ALREADY_IN_USE: {
        status: "EMAIL_ALREADY_IN_USE",
        cose: 700,
        info: {
            title: 'email_already_in_use',
            message: 'change_email'
        }
    },


    LEAGUE_NOT_FOUND: {
        status: "LEAGUE_NOT_FOUND",
        cose: 700,
        info: {
            title: 'league_not_found',
            message: 'try_change_leaguename'
        }
    },

    LEAGUE_PRESENT: {
        status: "LEAGUE_PRESENT",
        cose: 700,
        info: {
            title: 'league_present',
            message: 'try_change_leaguename'
        }
    },



    WRONG_USER: {
        status: "WRONG_USER",
        cose: 700,
        info: {
            title: 'wrong_user',
            message: 'try_change_user'
        }
    },

    FULL_LEAGUE: {
        status: "FULL_LEAGUE",
        cose: 700,
        info: {
            title: 'league_full',
            message: 'cannot_join_league'
        }
    },

    USER_TEAM_PRESENT: {
        status: "USER_TEAM_PRESENT",
        cose: 700,
        info: {
            title: 'user_joined_league',
            message: 'join_league_from_home'
        }
    },

    TEAM_PRESENT: {
        status: "TEAM_PRESENT",
        cose: 700,
        info: {
            title: 'team_present_in_league',
            message: 'try_change_teamname'
        }
    }


    /*
        LEAGUE_NAME_EMPTY: {
            status: "LEAGUE_NAME_EMPTY",
            cose: 700,
            info: {
                title: 'league_name_empty',
                message: 'leaguename_need_value'
            }
        },
    
        USERNAME_EMPTY: {
            status: "USERNAME_EMPTY",
            cose: 700,
            info: {
                title: 'username_empty',
                message: 'username_need_value'
            }
        },
    
        LEAGUE_NAME_SHORTS: {
            status: "USERNAME_EMPTY",
            cose: 700,
            info: {
                title: 'league_name_short',
                message: 'league_min_length_6'
            }
        },
    
        LEAGUE_PASSWORD_EMPTY: {
            status: "LEAGUE_PASSWORD_EMPTY",
            cose: 700,
            info: {
                title: 'league_password_empty',
                message: 'password_need_value'
            }
        },
    
        LEAGUE_PASSWORD_SHORT: {
            status: "LEAGUE_PASSWORD_SHORT",
            cose: 700,
            info: {
                title: 'league_password_short',
                message: 'passowrd_min_length_6'
            }
        },
    
        LEAGUE_ATTENDEES_NOT_CORRECT: {
            status: "LEAGUE_ATTENDEES_NOT_CORRECT",
            cose: 700,
            info: {
                title: 'league_attendees_not_correct',
                message: 'league_attendees_not_correct'
            }
        },
    
        PLAYERS_NUMBER_ERROR: {
            status: "PLAYERS_NUMBER_ERROR",
            cose: 700,
            info: {
                title: 'players_number_not_correct',
                message: 'modify_number_players_and_retry'
            }
        }
        */
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

export {
    Errors,
    PASSWORD_OPT
}
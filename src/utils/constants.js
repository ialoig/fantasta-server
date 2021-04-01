
const Errors = {

    INT_SERV_ERR: {
        status: "INT_SERV_ERR",
        code: 701,
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

    WRONG_PASSWORD: {
        status: "WRONG_PASSWORD",
        code: 703,
        info: {
            title: 'wrong_password',
            message: 'try_change_password'
        }
    },

    EMAIL_NOT_FOUND: {
        status: "EMAIL_NOT_FOUND",
        code: 704,
        info: {
            title: 'email_not_found',
            message: 'change_email'
        }
    },

    EMAIL_ALREADY_EXISTS: {
        status: "EMAIL_ALREADY_EXISTS",
        code: 705,
        info: {
            title: 'email_already_exists',
            message: 'change_email'
        }
    },

    TOKEN_NOT_VALID: {
        status: "TOKEN_NOT_VALID",
        code: 706,
        info: {
            title: 'authentication_failed',
            message: 'change_credentials'
        }
    },

    LEAGUE_ALREADY_EXISTS: {
        status: "LEAGUE_ALREADY_EXISTS",
        code: 707,
        info: {
            title: 'league_already_exists',
            message: 'change_league_name'
        }
    },

    LEAGUE_NOT_FOUND: {
        status: "LEAGUE_NOT_FOUND",
        code: 708,
        info: {
            title: 'league_not_found',
            message: 'try_change_leaguename'
        }
    },

    USER_PRESENT_IN_LEAGUE: {
        status: "USER_PRESENT_IN_LEAGUE",
        code: 709,
        info: {
            title: 'user_already_present_in_league',
            message: ''
        }
    },

    TEAM_PRESENT_IN_LEAGUE: {
        status: "TEAM_PRESENT_IN_LEAGUE",
        code: 710,
        info: {
            title: 'team_already_present_in_league',
            message: 'change_team_name'
        }
    },

    FULL_LEAGUE: {
        status: "FULL_LEAGUE",
        code: 711,
        info: {
            title: 'league_full',
            message: 'cannot_join_league'
        }
    }

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

const Errors = {
    INT_SERV_ERR: {
        status: "INT_SERV_ERR",
        code: 700,
        info: {
            title: 'internal_server_error',
            message: 'something_went_wrong'
        }
    },
    TOKEN_NOT_VALID: {
        status: "TOKEN_NOT_VALID",
        code: 701,
        info: {
            title: 'authentication_failed',
            message: 'change_credentials'
        }
    },
    PARAMS_ERROR: {
        status: "PARAMS_ERROR",
        code: 710,
        info: {
            title: 'params_error',
            message: 'params_not_correct'
        }
    },
    EMAIL_ERROR: {
        status: "EMAIL_ERROR",
        code: 711,
        info: {
            title: 'email_error',
            message: 'email_not_correct'
        }
    },
    PASSWORD_ERROR: {
        status: "PASSWORD_ERROR",
        code: 712,
        info: {
            title: 'password_error',
            message: 'password_not_correct'
        }
    },
    EMAIL_PASSWORD_ERROR: {
        status: "EMAIL_PASSWORD_ERROR",
        code: 713,
        info: {
            title: 'login_error',
            message: 'email_and_or_password_error'
        }
    },
    USER_NOT_FOUND: {
        status: "USER_NOT_FOUND",
        code: 721,
        info: {
            title: 'user_not_found',
            message: 'change_user'
        }
    },
    EMAIL_NOT_FOUND: {
        status: "EMAIL_NOT_FOUND",
        code: 722,
        info: {
            title: 'email_not_found',
            message: 'change_email'
        }
    },
    WRONG_PASSWORD: {
        status: "WRONG_PASSWORD",
        code: 731,
        info: {
            title: 'wrong_password',
            message: 'password_not_correct'
        }
    },
    WRONG_EMAIL: {
        status: "WRONG_EMAIL",
        code: 731,
        info: {
            title: 'wrong_password',
            message: 'password_not_correct'
        }
    },
    EMAIL_ALREADY_EXISTS: {
        status: "EMAIL_ALREADY_EXISTS",
        code: 740,
        info: {
            title: 'email_already_exists',
            message: 'change_email'
        }
    },
    LEAGUE_ALREADY_EXISTS: {
        status: "LEAGUE_ALREADY_EXISTS",
        code: 761,
        info: {
            title: 'league_already_exists',
            message: 'change_league_name'
        }
    },
    LEAGUE_NOT_FOUND: {
        status: "LEAGUE_NOT_FOUND",
        code: 762,
        info: {
            title: 'league_not_found',
            message: 'try_change_leaguename'
        }
    },
    USER_PRESENT_IN_LEAGUE: {
        status: "USER_PRESENT_IN_LEAGUE",
        code: 763,
        info: {
            title: 'user_already_present_in_league',
            message: 'join_league_from_home'
        }
    },
    TEAM_PRESENT_IN_LEAGUE: {
        status: "TEAM_PRESENT_IN_LEAGUE",
        code: 764,
        info: {
            title: 'team_already_present_in_league',
            message: 'change_team_name'
        }
    },
    FULL_LEAGUE: {
        status: "FULL_LEAGUE",
        code: 765,
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
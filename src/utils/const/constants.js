
const Constants = {
    OK: "OK",
    NOT_FOUND: "NOT_FOUND",
    USER_NOT_FOUND: "USER_NOT_FOUND",
    BAD_REQUEST: "BAD_REQUEST",
    INT_SERV_ERR: "INT_SERV_ERR",
    WRONG_PASSWORD: "WRONG_PASSWORD",
    WRONG_USER: "WRONG_USER",
    FULL_LEAGUE: "FULL_LEAGUE",
    LEAGUE_NOT_FOUND: "LEAGUE_NOT_FOUND",
    TEAM_NOT_FOUND: "TEAM_NOT_FOUND",
    USER_TEAM_PRESENT: "USER_TEAM_PRESENT",
    TEAM_PRESENT: "TEAM_PRESENT",
    USER_PRESENT: "USER_PRESENT",
    LEAGUE_PRESENT: "LEAGUE_PRESENT"
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
    Constants,
    PASSWORD_OPT
}
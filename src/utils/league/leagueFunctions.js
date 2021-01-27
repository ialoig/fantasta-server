
const errors = {
    PARAMS_MISSING: 'PARAMS_MISSING',
    CUSTOM_STARTING_PRICE_ERROR: 'CUSTOM_STARTINGPRICE_ERROR',
    PLAYERS_NUMBER_ERROR: 'PLAYERS_NUMBER_ERROR',
    LEAGUE_NAME_EMPTY: 'LEAGUE_NAME_EMPTY',
    LEAGUE_NAME_SHORT: 'LEAGUE_NAME_SHORTS',
    USERNAME_EMPTY: 'USERNAME_EMPTY',
    LEAGUE_PASSWORD_EMPTY: 'LEAGUE_PASSWORD_EMPTY',
    LEAGUE_PASSWORD_SHORT: 'LEAGUE_PASSWORD_SHORT',
    LEAGUE_ATTENDEES_NOT_CORRECT: 'LEAGUE_ATTENDEES_NOT_CORRECT'
}

const validateleague = ( leagueData, newLeague ) =>
{
    var ret = {
        valid: false,
        error: ''
    }

    if ( !leagueData.name )
    {
        ret.error = errors.LEAGUE_NAME_EMPTY
    }
    else if ( newLeague && leagueData.name.length<6 )
    {
        ret.error = errors.LEAGUE_NAME_SHORT
    }
    else if ( !leagueData.username )
    {
        ret.error = errors.USERNAME_EMPTY
    }
    else if ( !leagueData.password )
    {
        ret.error = errors.LEAGUE_PASSWORD_EMPTY
    }
    else if ( newLeague && leagueData.password.length<6 )
    {
        ret.error = errors.LEAGUE_PASSWORD_SHORT
    }
    else if ( newLeague && leagueData.attendees<2 )
    {
        ret.error = errors.LEAGUE_ATTENDEES_NOT_CORRECT
    }
    else
    {
        ret.valid = true
    }
    return ret
}

const validateSettings = ( leagueSettingsData ) =>
{
    var ret = {
        valid: false,
        error: ''
    }

    if ( !leagueSettingsData.millions || !leagueSettingsData.players || !leagueSettingsData.startingPlayerPrice || !leagueSettingsData.leagueSystem )
    {
        ret.error = leagueErrors.PARAMS_MISSING
    }
    else if ( leagueSettingsData.startingPlayerPrice=='C' && !leagueSettingsData.customStartingPrice )
    {
        ret.error = leagueErrors.CUSTOM_STARTING_PRICE_ERROR
    }
    else if ( leagueSettingsData.leagueSystem=='C' &&
        leagueSettingsData.players!=leagueSettingsData.goalkeepers+leagueSettingsData.defenders+leagueSettingsData.midfielders+leagueSettingsData.strikers)
    {
        ret.error = leagueErrors.PLAYERS_NUMBER_ERROR
    }
    else
    {
        ret.valid = true
    }
    return ret
}

const getleagueObj = ( league ) =>
{
    var obj = JSON.parse(JSON.stringify(league))

    var leag = {
        id: obj._id,
        attendees: obj.attendees,
        name: obj.name,
        total_attendees: obj.total_attendees
    }

    return leag
}


export default {
    validateSettings,
    validateleague,
    getleagueObj,
}

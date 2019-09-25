
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
};

var validateleague = function ( leagueData, newLeague )
{
    var ret = {
        valid: false,
        error: ''
    };

    if ( !leagueData.name )
    {
        ret.error = errors.LEAGUE_NAME_EMPTY;
    }
    else if ( newLeague && leagueData.name.length<6 )
    {
        ret.error = errors.LEAGUE_NAME_SHORT;
    }
    else if ( !leagueData.username )
    {
        ret.error = errors.USERNAME_EMPTY;
    }
    else if ( !leagueData.password )
    {
        ret.error = errors.LEAGUE_PASSWORD_EMPTY;
    }
    else if ( newLeague && leagueData.password.length<6 )
    {
        ret.error = errors.LEAGUE_PASSWORD_SHORT;
    }
    else if ( newLeague && leagueData.attendees<2 )
    {
        ret.error = errors.LEAGUE_ATTENDEES_NOT_CORRECT;
    }
    else
    {
        ret.valid = true;
    }
    return ret;
};

var validateSettings = function ( leagueSettingsData )
{
    var ret = {
        valid: false,
        error: ''
    };

    if ( !leagueSettingsData.millions || !leagueSettingsData.players || !leagueSettingsData.startingPlayerPrice || !leagueSettingsData.leagueSystem )
    {
        ret.error = leagueErrors.PARAMS_MISSING;
    }
    else if ( leagueSettingsData.startingPlayerPrice=='C' && !leagueSettingsData.customStartingPrice )
    {
        ret.error = leagueErrors.CUSTOM_STARTING_PRICE_ERROR;
    }
    else if ( leagueSettingsData.leagueSystem=='C' &&
        leagueSettingsData.players!=leagueSettingsData.goalkeepers+leagueSettingsData.defenders+leagueSettingsData.midfielders+leagueSettingsData.strikers)
    {
        ret.error = leagueErrors.PLAYERS_NUMBER_ERROR;
    }
    else
    {
        ret.valid = true;
    }
    return ret;
};

var getleagueObj = function ( league )
{
    var obj = JSON.parse(JSON.stringify(league));

    var leag = {
        id: obj._id,
        attendees: obj.attendees,
        name: obj.name,
        total_attendees: obj.total_attendees
    };

    return leag;
}

var getAuctionObj = function ( auction )
{
    var obj = JSON.parse(JSON.stringify(auction));

    var auct = {
        id: obj._id,
        attendees: obj.attendees,
        countdown: obj.countdown,
        totalAttendees: obj.totalAttendees,
        customPrice: obj.customPrice,
        leagueSystem: obj.leagueSystem,
        millions: obj.millions,
        name: obj.name,
        num_defenders: obj.num_defenders,
        num_goalkeepers: obj.num_goalkeepers,
        num_midfielders: obj.num_midfielders,
        num_players: obj.num_players,
        num_strikers: obj.num_strikers,
        startingPrice: obj.startingPrice,
        teams: obj.teams
    };

    return auct;
}

module.exports = {
    validateSettings,
    validateleague,
    getleagueObj,
    getAuctionObj,
}

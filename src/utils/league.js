
import _ from 'lodash'

const errors = {
    LEAGUE_NAME_ERROR: 'LEAGUE_NAME_ERROR',
    TEAM_ERROR: 'TEAM_ERROR',
    LEAGUE_PASSWORD_ERROR: 'LEAGUE_PASSWORD_EMPTY',
    ATTENDEES_ERROR: 'ATTENDEES_ERROR',
    PLAYERS_NUMBER_ERROR: 'PLAYERS_NUMBER_ERROR',
    START_PRICE_ERROR: 'START_PRICE_ERROR',
    AUCTION_TYPE_ERROR: 'AUCTION_TYPE_ERROR',
    BUDGET_ERROR: 'BUDGET_ERROR',
    COUNTDOWN_ERROR: 'COUNTDOWN_ERROR'
}

const validateleague = ( leagueData ) =>
{
    var ret = {
        valid: false,
        settings: {},
        error: ''
    }

    if ( !leagueData.name )
    {
        ret.error = errors.LEAGUE_NAME_ERROR
    }
    else if ( !leagueData.password )
    {
        ret.error = errors.LEAGUE_PASSWORD_ERROR
    }
    else if ( !leagueData.teamname )
    {
        ret.error = errors.TEAM_ERROR
    }
    else if ( ![ "alphabetic", "call", "random" ].includes(leagueData.auctionType) )
    {
        ret.error = errors.AUCTION_TYPE_ERROR
    }
    else if ( ![ "zero", "listPrice" ].includes(leagueData.startPrice) )
    {
        ret.error = errors.START_PRICE_ERROR
    }
    else if ( parseInt(leagueData.partecipants)<2 )
    {
        ret.error = errors.ATTENDEES_ERROR
    }
    else if ( parseInt(leagueData.goalkeepers)<1 )
    {
        ret.error = errors.PLAYERS_NUMBER_ERROR
    }
    else if ( parseInt(leagueData.defenders)<4 )
    {
        ret.error = errors.PLAYERS_NUMBER_ERROR
    }
    else if ( parseInt(leagueData.midfielders)<4 )
    {
        ret.error = errors.PLAYERS_NUMBER_ERROR
    }
    else if ( parseInt(leagueData.strikers)<2 )
    {
        ret.error = errors.PLAYERS_NUMBER_ERROR
    }
    else if ( parseInt(leagueData.players)<10 )
    {
        ret.error = errors.PLAYERS_NUMBER_ERROR
    }
    else if ( parseInt(leagueData.budget)<11 )
    {
        ret.error = errors.BUDGET_ERROR
    }
    else if ( parseInt(leagueData.countdown)<3 )
    {
        ret.error = errors.COUNTDOWN_ERROR
    }
    else
    {
        ret.valid = true

        ret.settings.name = _.toString(leagueData.name)
        ret.settings.password = _.toString(leagueData.password)
        ret.settings.auctionType = leagueData.auctionType
        ret.settings.startPrice = leagueData.startPrice
        ret.settings.partecipants = parseInt(leagueData.partecipants)
        ret.settings.goalkeepers = parseInt(leagueData.goalkeepers)
        ret.settings.defenders = parseInt(leagueData.defenders)
        ret.settings.midfielders = parseInt(leagueData.midfielders)
        ret.settings.strikers = parseInt(leagueData.strikers)
        ret.settings.players = parseInt(leagueData.players)
        ret.settings.budget = parseInt(leagueData.budget)
        ret.settings.countdown = parseInt(leagueData.countdown)
    }
    return ret
}

const parseLeague = ( league ) =>
{
    let leag = {
        _id: league._id,
        admin: {
            _id: league.admin._id,
            email: league.admin.email,
            name: league.admin.email
        },
        auctionType: league.auctionType,
        budget: league.budget,
        countdown: league.countdown,
        createdAt: league.createdAt.toISOString(),
        updatedAt: league.updatedAt.toISOString(),
        defenders: league.defenders,
        goalkeepers: league.goalkeepers,
        midfielders: league.midfielders,
        name: league.name,
        partecipants: league.partecipants,
        password: league.password,
        players: league.players,
        startPrice: league.startPrice,
        strikers: league.strikers,
        teams: []
    }

    for ( let i=0; i<league.teams.length; i++ )
    {
        leag.teams.push( parseTeam(league.teams[i]) )
    }

    return leag
}

const parseTeam = ( team ) =>
{
    let tm = {
        _id: team._id,
        budget: team.budget,
        name: team.name,
        budget: team.budget,
        createdAt: team.createdAt.toISOString(),
        updatedAt: team.updatedAt.toISOString(),
        footballPlayers: [],
        user: {
            _id: team.user._id,
            email: team.user.email,
            name: team.user.name
        }
    }

    return tm
}

export default {
    validateleague,
    parseLeague,
    parseTeam
}

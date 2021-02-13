
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
    let error = ''

    if ( !leagueData.name )
    {
        error = errors.LEAGUE_NAME_ERROR
    }
    else if ( !leagueData.password )
    {
        error = errors.LEAGUE_PASSWORD_ERROR
    }
    else if ( !leagueData.teamname )
    {
        error = errors.TEAM_ERROR
    }
    else if ( ![ "alphabetic", "call", "random" ].includes(leagueData.auctionType) )
    {
        error = errors.AUCTION_TYPE_ERROR
    }
    else if ( ![ "zero", "listPrice" ].includes(leagueData.startPrice) )
    {
        error = errors.START_PRICE_ERROR
    }
    else if ( parseInt(leagueData.participants)<2 )
    {
        error = errors.ATTENDEES_ERROR
    }
    else if ( parseInt(leagueData.goalkeepers)<1 )
    {
        error = errors.PLAYERS_NUMBER_ERROR
    }
    else if ( parseInt(leagueData.defenders)<4 )
    {
        error = errors.PLAYERS_NUMBER_ERROR
    }
    else if ( parseInt(leagueData.midfielders)<4 )
    {
        error = errors.PLAYERS_NUMBER_ERROR
    }
    else if ( parseInt(leagueData.strikers)<2 )
    {
        error = errors.PLAYERS_NUMBER_ERROR
    }
    else if ( parseInt(leagueData.players)<10 )
    {
        error = errors.PLAYERS_NUMBER_ERROR
    }
    else if ( parseInt(leagueData.budget)<11 )
    {
        error = errors.BUDGET_ERROR
    }
    else if ( parseInt(leagueData.countdown)<3 )
    {
        error = errors.COUNTDOWN_ERROR
    }
    else
    {
        return {
            name: _.toString(leagueData.name),
            password: _.toString(leagueData.password),
            auctionType: leagueData.auctionType,
            startPrice: leagueData.startPrice,
            participants: parseInt(leagueData.participants),
            goalkeepers: parseInt(leagueData.goalkeepers),
            defenders: parseInt(leagueData.defenders),
            midfielders: parseInt(leagueData.midfielders),
            strikers: parseInt(leagueData.strikers),
            players: parseInt(leagueData.players),
            budget: parseInt(leagueData.budget),
            countdown: parseInt(leagueData.countdown)
        }
    }
    throw error
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
        participants: league.participants,
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

import Joi from "joi" // validation library

const team_id = Joi.string().required()
const user_id = Joi.string().required()
const league_id = Joi.string().required()

const listOfTeam = Joi.array().items(Joi.object({ team_id: team_id }))
const room = Joi.string().required() // TODO: as league_id but market_id
const football_player_id = Joi.number().strict().required()
const bet = Joi.number().strict().required()

// client messages
const clientLeagueUserOnlineSchema = Joi.object({ user_id: user_id, team_id: team_id, league_id: league_id })
const clientLeagueUserNewSchema = clientLeagueUserOnlineSchema
const clientLeagueMarketOpen = Joi.object({ room: room })
const clientMarketFootballPlayerSelected = Joi.object({ football_player_id: football_player_id, bet: bet })

// server messages
const serverLeagueUserNewOrOnlineSchema = listOfTeam
const serverUserOfflineSchema = listOfTeam
const serverUserDeletedSchema = listOfTeam
const serverMarketOpenSchema = listOfTeam
const serverMarketUserOnlineSchema = listOfTeam
const serverMarketSearchSchema = Joi.object({ turn: team_id })
const serverMarketFootballPlayerSelected = Joi.object({ team_id: team_id, football_player_id: football_player_id, bet: bet })

export const Schemas = {
	clientLeagueUserNewSchema,
	clientLeagueUserOnlineSchema,
	clientLeagueMarketOpen,
	clientMarketFootballPlayerSelected,
	serverLeagueUserNewOrOnlineSchema,
	serverUserOfflineSchema,
	serverUserDeletedSchema,
	serverMarketOpenSchema,
	serverMarketUserOnlineSchema,
	serverMarketSearchSchema,
	serverMarketFootballPlayerSelected
}
import Joi from "joi" // validation library

const team_id = Joi.string().required()
const user_id = Joi.string().required()
const league_id = Joi.string().required()

const listOfTeam = Joi.array().items(Joi.object({ team_id: team_id }))
const room = Joi.string().required() // TODO: as league_id but market_id
const footballPlayer_id = Joi.number().strict().required()
const bid = Joi.number().strict().required()

// client messages
const clientLeagueUserOnlineSchema = Joi.object({ user_id: user_id, team_id: team_id, league_id: league_id })
const clientLeagueUserNewSchema = clientLeagueUserOnlineSchema
const clientLeagueMarketOpen = Joi.object({ room: room })
const clientMarketFootballPlayerSelected = Joi.object({ team_id: team_id, footballPlayer_id: footballPlayer_id, bid: bid })

// server messages
const serverLeagueUserNewOrOnlineSchema = listOfTeam
const serverUserOfflineSchema = listOfTeam
const serverUserDeletedSchema = listOfTeam
const serverMarketOpenSchema = listOfTeam
const serverMarketUserOnlineSchema = listOfTeam
const serverMarketSearchSchema = Joi.object({ team_id: Joi.string().allow("") })
const serverMarketFootballPlayerSelected = Joi.object({ team_id: team_id, footballPlayer_id: footballPlayer_id, bid: bid })

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
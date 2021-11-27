import Joi from "joi" // validation library

const listOfUser = Joi.array().items(Joi.string())
const room = Joi.string().required()
const user = Joi.string().required()
const football_player_id = Joi.number().strict().required()
const bet = Joi.number().strict().required()

// client messages
const clientLeagueUserOnlineSchema = Joi.object({room: room, user: user})
const clientLeagueUserNewSchema = clientLeagueUserOnlineSchema
const clientLeagueMarketOpen = Joi.object({room: room})
const clientMarketFootballPlayerSelected = Joi.object({football_player_id: football_player_id, bet: bet})

// server messages
const serverLeagueUserNewOrOnlineSchema = listOfUser
const serverUserOfflineSchema = listOfUser
const serverUserDeletedSchema = listOfUser
const serverMarketOpenSchema = listOfUser
const serverMarketUserOnlineSchema = listOfUser
const serverMarketSearchSchema = Joi.object({turn: user})
const serverMarketFootballPlayerSelected = Joi.object({user: user, football_player_id: football_player_id, bet: bet})

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
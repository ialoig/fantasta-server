import Joi from "joi" // validation library

const listOfUser = Joi.array().items(Joi.string())
const room = Joi.string().required()
const user = Joi.string().required()
const football_player = user
const bet = Joi.number().required()

// client messages
const clientLeagueUserOnlineSchema = Joi.object({room: room, user: user})
const clientLeagueUserNewSchema = clientLeagueUserOnlineSchema
const clientLeagueMarketOpen = Joi.object({room: room})
const clientMarketPlayerSelected = Joi.object({football_player: football_player, bet: bet})

// server messages
const serverLeagueUserNewOrOnlineSchema = listOfUser
const serverUserOfflineSchema = listOfUser
const serverUserDeletedSchema = listOfUser
const serverMarketOpenSchema = listOfUser
const serverMarketUserOnlineSchema = listOfUser
const serverMarketSearchSchema = Joi.object({turn: user})
const serverMarketPlayerSelected = Joi.object({user: user, football_player: football_player, bet: bet})


export const Schemas = {
    clientLeagueUserNewSchema,
    clientLeagueUserOnlineSchema,
    clientLeagueMarketOpen,
    clientMarketPlayerSelected,

    serverLeagueUserNewOrOnlineSchema,
    serverUserOfflineSchema,
    serverUserDeletedSchema,
    serverMarketOpenSchema,
    serverMarketUserOnlineSchema,
    serverMarketSearchSchema,
    serverMarketPlayerSelected
}
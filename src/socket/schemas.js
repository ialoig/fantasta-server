import Joi from "joi" // validation library

const listOfUser = Joi.array().items(Joi.string())
const room = Joi.string().required()
const player = Joi.string().required()

// client messages
const clientLeagueUserOnlineSchema = Joi.object({room: room, player: player})
const clientLeagueUserNewSchema = clientLeagueUserOnlineSchema
const clientLeagueMarketOpen = Joi.object({room: room})
const clientMarketPlayerSelected = Joi.object({football_player: player})

// server messages
const serverLeagueUserNewOrOnlineSchema = listOfUser
const serverUserOfflineSchema = listOfUser
const serverUserDeletedSchema = listOfUser
const serverMarketOpenSchema = listOfUser
const serverMarketUserOnlineSchema = listOfUser
const serverMarketSearchSchema = Joi.object({turn: player})


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
    serverMarketSearchSchema
}
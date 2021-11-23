import Joi from "joi" // validation library

const clientLeagueUserOnlineSchema = Joi.object({
    room: Joi.string().required(),
    player: Joi.string().required()
})

const clientLeagueUserNewSchema = clientLeagueUserOnlineSchema

const serverLeagueUserOnlineSchema = Joi.array().items(Joi.string())
const serverUserOfflineSchema = Joi.array().items(Joi.string())

export const Schemas = {
    clientLeagueUserNewSchema,
    clientLeagueUserOnlineSchema,
    serverLeagueUserOnlineSchema,
    serverUserOfflineSchema
}
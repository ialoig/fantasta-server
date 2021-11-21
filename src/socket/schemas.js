import Joi from "joi" // validation library

const userNewClientSchema = Joi.object({
    room: Joi.string().required(),
    player: Joi.string().required()
})

const userOnlineServerSchema = Joi.object({
    event_type: Joi.number().integer().required(),
    data: Joi.array().items(Joi.string()).required()
})

const userOnlineClientSchema = userNewClientSchema
const userOfflineServerSchema = userOnlineServerSchema

export const Schemas = {
    userNewClientSchema,
    userOnlineClientSchema,
    userOnlineServerSchema,
    userOfflineServerSchema
}
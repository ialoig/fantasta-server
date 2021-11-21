import Joi from "joi" // validation library

const userOnlineClientSchema = Joi.object({
    room: Joi.string().required(),
    player: Joi.string().required()
})

const userOnlineServerSchema = Joi.object({
    event_type: Joi.number().integer().required(),
    data: Joi.array().items(Joi.string()).required()
})

const userOfflineServerSchema = Joi.object({
    event_type: Joi.number().integer().required(),
    data: Joi.array().items(Joi.string()).required()
})

export const Schemas = {
    userOnlineClientSchema,
    userOnlineServerSchema,
    userOfflineServerSchema
}
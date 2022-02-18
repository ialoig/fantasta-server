
import mongoose from 'mongoose'
const { Schema, model } = mongoose

import _ from 'lodash'

const leagueSchema = new Schema(
    {
        name: {
            type: Schema.Types.String,
            required: true,
            unique: true,
            index: true,
            validate: {
                validator: (v) => {
                    return _.isString(v) && v.length <= 40
                },
                message: props => `${props.value} is not a valid league name!`
            }
        },
        password: {
            type: Schema.Types.String,
            required: true,
            validate: {
                validator: (v) => {
                    return _.isString(v) && v.length <= 40
                },
                message: props => `${props.value} is not a valid password!`
            }
        },
        admin: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        participants: {
            type: Schema.Types.Number,
            required: true,
            min: 2,
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value for participants"
            }
        },
        type: {
            type: Schema.Types.String,
            enum: ["classic", "mantra"],
            required: true
        },
        goalkeepers: {
            type: Schema.Types.Number,
            required: true,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value for goalkeeper"
            }
        },
        defenders: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value for defenders"
            }
        },
        midfielders: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value for midfielders"
            }
        },
        strikers: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value for strikers"
            }
        },
        players: {
            type: Schema.Types.Number,
            required: true,
            min: 0,
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value for players"
            }
        },
        budget: {
            type: Schema.Types.Number,
            required: true,
            min: 11,
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value for budget"
            }
        },
        countdown: {
            type: Schema.Types.Number,
            required: true,
            min: 3,
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value for countdown"
            }
        },
        auctionType: {
            type: Schema.Types.String,
            enum: ["alphabetic", "call", "random"],
            required: true
        },
        startPrice: {
            type: Schema.Types.String,
            enum: ["zero", "listPrice"],
            required: true
        },
        teams: [{
            type: Schema.Types.ObjectId,
            ref: "Team"
        }],
        status: {
            type: Schema.Types.String,
            enum: ["new", "active", "paused", "closed"],
            required: true
        },
        isDeleted: {
            type: Schema.Types.Boolean,
            required: false
        },
        footballPlayers: {
            type: Schema.Types.Object,
            required: false
        },
        market:[{
            // List of Markets associated to that league. Last element of the array correspond to the latest Market
            type: Schema.Types.ObjectId,
            ref: "Market",
            default: []
        }],
    },
    {
        timestamps: true, // createdAt, updatedAt automatically added by mongoose
    }
);

const League = model('League', leagueSchema)

export default League

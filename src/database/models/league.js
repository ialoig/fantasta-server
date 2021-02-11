
import { Schema, model } from 'mongoose'
import _ from 'lodash'

const leagueSchema = new Schema(
    {
        name: {
            type: Schema.Types.String,
            required: true,
            unique: true,
            validate: {
                validator: (v) => {
                    return _.isString(v) && v.length<=40
                },
                message: props => `${props.value} is not a valid league name!`
            }
        },
        password: {
            type: Schema.Types.String,
            required: true,
            validate: {
                validator: (v) => {
                    return _.isString(v) && v.length<=40
                },
                message: props => `${props.value} is not a valid password!`
            }
        },
        admin: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        partecipants: {
            type: Schema.Types.Number,
            required: true,
            min: 2,
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value for partecipants"
            }
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
            min: 4,
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value for defenders"
            }
        },
        midfielders: {
            type: Schema.Types.Number,
            required: true,
            min: 4,
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value for midfielders"
            }
        },
        strikers: {
            type: Schema.Types.Number,
            required: true,
            min: 2,
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value for strikers"
            }
        },
        players: {
            type: Schema.Types.Number,
            required: true,
            min: 10,
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
            enum: [ "alphabetic", "call", "random" ],
            required: true
        },
        startPrice: {
            type: Schema.Types.String,
            enum: [ "zero", "listPrice" ],
            required: true
        },
        teams: [{
            type: Schema.Types.ObjectId,
            ref: "Team"
        }]
    },
    {
        timestamps: true, // createdAt, updatedAt automatically added by mongoose
    }
);

const League = model( 'League', leagueSchema )

export default League

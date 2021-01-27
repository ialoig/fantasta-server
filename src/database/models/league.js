
import { Schema, model } from 'mongoose'

const leagueSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        admin: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        numParticipants: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            enum: [ "alphabetic", "call", "random" ],
            required: true
        },
        numGoalkeeper: {
            type: Number,
            required: true,
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value for numGoalkeeper"
            }
        },
        numDefenders: {
            type: Number,
            required: true,
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value for numDefenders"
            }
        },
        numMidfielders: {
            type: Number,
            required: true,
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value for numMidfielders"
            }
        },
        numStrikers: {
            type: Number,
            required: true,
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value for numStrikers"
            }
        },
        teamBudget: {
            type: Number,
            required: true,
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value for teamBudget"
            }
        },
        auctionCountdownSeconds: {
            type: Number,
            required: true,
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value for auctionCountdownSeconds"
            }
        },
        auctionType: {
            type: String,
            enum: [ "alphabetic", "call", "random" ],
            required: true
        },
        auctionStartPrice: {
            type: String,
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

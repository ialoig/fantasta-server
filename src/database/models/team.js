
import { Schema, model } from 'mongoose'

const teamSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        footballPlayers: [{
            type: Number,
            required: false
        }],
        budget: {
            type: Number,
            required: true,
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value for budget"
            }
        },
        league: {
            type: Schema.Types.ObjectId,
            ref: "League",
            required: true
        }
    },
    {
        timestamps: true // createdAt, updatedAt automatically added by mongoose
    }
)

const Team = model( 'Team', teamSchema )

export default Team

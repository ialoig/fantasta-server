
import { Schema, model } from 'mongoose'

const teamSchema = new Schema(
    {
        name: {
            type: Schema.Types.String,
            required: true
        },
        footballPlayers: [{
            type: Schema.Types.Number,
            required: false
        }],
        budget: {
            type: Schema.Types.Number,
            required: true,
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value for budget"
            }
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true // createdAt, updatedAt automatically added by mongoose
    }
)

const Team = model( 'Team', teamSchema )

export default Team

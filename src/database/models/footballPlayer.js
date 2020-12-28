
import { Schema, model } from 'mongoose'

const footballPlayerSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        team: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: [ "por", "dif", "cen", "att" ],
            required: true
        },
        roleMantra: [{
            type: String,
            enum: [ "por", "ds", "dc", "dd", "e", "m", "c", "w", "t", "a", "pc" ],
            required: true
        }],
        price: {
            type: Number,
            required: true,
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer value for price"
            }
        }
    },
    {
        timestamps: true
    }
)

const FootballPlayer = model( 'FootballPlayer', footballPlayerSchema )

export default FootballPlayer

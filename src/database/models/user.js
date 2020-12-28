
import { Schema, model } from 'mongoose'

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        uuid: {
            type: String,
            required: true,
            unique: true
        },
        teams: [{
            type: Schema.Types.ObjectId,
            ref: "Team"
        }]
    },
    {
        // createdAt: Date (default added by mongoose)
        // updatedAt: Date (default added by mongoose)
        timestamps: true
    }
)

const User = model( 'User', userSchema )

export default User

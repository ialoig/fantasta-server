
import { Schema, model } from 'mongoose'

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: false
        },
        leagues: [{
            type: Schema.Types.ObjectId,
            ref: "League"
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

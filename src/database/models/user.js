
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
            ref: "League",
            required: false
        }]
    },
    {
        timestamps: true // createdAt, updatedAt automatically added by mongoose
    }
);

const User = model('User', userSchema)

export default User

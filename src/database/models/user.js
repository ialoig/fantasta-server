
import { Schema, model } from 'mongoose'

const userSchema = new Schema(
    {
        email: {
            type: Schema.Types.String,
            required: true,
            unique: true,
            index: true
        },
        password: {
            type: Schema.Types.String,
            required: true
        },
        name: {
            type: Schema.Types.String,
            required: false
        },
        leagues: [{
            type: Schema.Types.ObjectId,
            ref: "League"
        }]
    },
    {
        timestamps: true // createdAt, updatedAt automatically added by mongoose
    }
);

const User = model('User', userSchema)

export default User

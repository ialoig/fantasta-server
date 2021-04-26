
import mongoose from 'mongoose'
const { Schema, model } = mongoose

const resetSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        expireAt: {
            type: Date,
            default: Date.now,
            require: true,
        }
    },
    {
        timestamps: true // createdAt, updatedAt automatically added by mongoose
    }
);

resetSchema.index({ expireAt: 1 }, { expireAfterSeconds : 86400 });

const Reset = model('Reset', resetSchema)

export default Reset

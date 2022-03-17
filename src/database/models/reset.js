
import mongoose from "mongoose"
const { Schema, model } = mongoose

const resetSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User"
		},
		createdAt: {
			type: Date,
			expires: "24h",
			default: Date.now
		}
	},
	{
		timestamps: true // createdAt, updatedAt automatically added by mongoose
	}
)

// resetSchema.index({ createdAt: 1 }, { expires: 10, expireAfterSeconds: 10 });

const Reset = model("Reset", resetSchema)

export default Reset

import mongoose from "mongoose"
const { Schema, model } = mongoose


const marketSchema = new Schema(
	{
		leagueId: {
			type: Schema.Types.ObjectId,
			ref: "League",
			required: true
		},
		active: {
			// after all users joined, admin can market starts
			type: Schema.Types.Boolean,
			default: false
		},
		onlineTeams: [{
			type: Schema.Types.ObjectId,
			ref: "Team",
			default: []
		}],
		teamTurnIndex: {
			type: Schema.Types.Number,
			default: 0
		},
		teamOrder: [{
			type: Schema.Types.Object,
			default: []
		}],
		footballPlayerList: [{
			type: Schema.Types.Object,
			default: []
		}],
		betHistory: [{
			footballPlayerId: {
				type: Schema.Types.Number,
				required: true,
			},
			bets: [{
				teamId: {
					type: Schema.Types.ObjectId,
					ref: "Team",
					required: true
				},
				value: {
					type: Schema.Types.Number,
					required: true,
				}
			}],
			default: []
		}],
		closedAt: {
			type: Schema.Types.Date,
			default: null
		}
	},
	{
		timestamps: true, // createdAt, updatedAt automatically added by mongoose
	}
)

const Market = model("Market", marketSchema)

export default Market

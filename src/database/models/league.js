
import { Schema, model } from 'mongoose'

const leagueSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        administrators: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }],
        leagueConfig: {
            type: Schema.Types.ObjectId,
            ref: "LeagueConfig"
        },
        auctionConfig: {
            type: Schema.Types.ObjectId,
            ref: "AuctionConfig"
        },
        numParticipants: {
            type: Number,
            required: true
        },
        teams: {
            type: Schema.Types.ObjectId,
            ref: "Team"
        }
    },
    {
        timestamps: true
    }
);

const League = model( 'League', leagueSchema )

export default League

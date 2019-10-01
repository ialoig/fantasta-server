
import { Schema, model } from "mongoose"


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
    administrators: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],
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

// create the model out of the schema
const League = model("League", leagueSchema);

// return the object to the caller when this file is imported
export default League;

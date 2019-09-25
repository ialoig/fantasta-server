const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],
    leagueConfig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeagueConfig"
    },
    auctionConfig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuctionConfig"
    },
    numParticipants: {
      type: Number,
      required: true
    },
    teams: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    }
  },
  {
    // createdAt: Date (default added by mongoose)
    // updatedAt: Date (default added by mongoose)
    timestamps: true
  }
);

// create the model out of the schema
const League = mongoose.model("League", leagueSchema);

// return the object to the caller when this file is imported
module.exports = League;

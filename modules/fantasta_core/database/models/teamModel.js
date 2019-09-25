const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    footballPlayers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "FootballPlayer" }
    ],
    budget: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value for budget"
      }
    },
    league: { type: mongoose.Schema.Types.ObjectId, ref: "League" }
  },
  {
    // createdAt: Date (default added by mongoose)
    // updatedAt: Date (default added by mongoose)
    timestamps: true
  }
);

// create the model out of the schema
const Team = mongoose.model("Team", teamSchema);

// return the object to the caller when this file is imported
module.exports = Team;

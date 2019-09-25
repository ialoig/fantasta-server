const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leagueConfig = new Schema(
  {
    mantra: {
      type: Boolean,
      required: true
    },
    numGoalkeeper: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value for numGoalkeeper"
      }
    },
    numDefenders: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value for numDefenders"
      }
    },
    numMidfielders: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value for numMidfielders"
      }
    },
    numStrikers: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value for numStrikers"
      }
    },
    teamBudget: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value for teamBudget"
      }
    }
  },
  {
    // createdAt: Date (default added by mongoose)
    // updatedAt: Date (default added by mongoose)
    timestamps: true
  }
);

// create the model out of the schema
const LeagueConfig = mongoose.model("LeagueConfig", leagueConfig);

// return the object to the caller when this file is imported
module.exports = LeagueConfig;

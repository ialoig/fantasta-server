
import { Schema, model } from "mongoose"

const leagueConfigSchema = new Schema(
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
    timestamps: true
  }
);

// create the model out of the schema
const LeagueConfig = model("LeagueConfig", leagueConfigSchema);

// return the object to the caller when this file is imported
export default LeagueConfig;

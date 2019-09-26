
import { Schema, model } from "mongoose"

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    footballPlayers: [
      { type: Schema.Types.ObjectId, ref: "FootballPlayer" }
    ],
    budget: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value for budget"
      }
    },
    league: { type: Schema.Types.ObjectId, ref: "League" }
  },
  {
    timestamps: true
  }
);

// create the model out of the schema
const Team = model("Team", teamSchema);

// return the object to the caller when this file is imported
export default Team;

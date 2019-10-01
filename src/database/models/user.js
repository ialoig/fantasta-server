
import { Schema, model } from "mongoose"

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    uuid: {
      type: String,
      required: true,
      unique: true
    },
    teams: [{ type: Schema.Types.ObjectId, ref: "Team" }]
  },
  {
    // createdAt: Date (default added by mongoose)
    // updatedAt: Date (default added by mongoose)
    timestamps: true
  }
);

// create the model out of the schema
const User = model("User", userSchema);

// return the object to the caller when this file is imported
export default User;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const footballPlayerSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    team: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["POR", "DIF", "CEN", "ATT"],
      required: true
    },
    roleMantra: [
      {
        type: String,
        enum: ["POR", "DS", "DC", "DD", "E", "M", "C", "W", "T", "A", "PC"],
        required: true
      }
    ],
    price: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value for price"
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
const FootballPlayer = mongoose.model("FootballPlayer", footballPlayerSchema);

// return the object to the caller when this file is imported
module.exports = FootballPlayer;

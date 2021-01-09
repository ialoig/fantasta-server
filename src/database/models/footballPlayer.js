import { Schema, model } from "mongoose";

const footballPlayerSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    team: {
      type: String,
      required: true,
    },
    roleClassic: {
      type: String,
      enum: ["P", "D", "C", "A"],
      required: true,
    },
    roleMantra: [
      {
        type: String,
        enum: ["Por", "Dd", "Ds", "Dc", "E", "M", "C", "W", "T", "A", "Pc"],
        required: true,
      },
    ],
    actualPrice: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value for 'actualPrice'",
      },
    },
    initialPrice: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value for 'initialPrice'",
      },
    },
  },
  {
    timestamps: true,
  }
);

footballPlayerSchema.statics.getAll = function () {
  return this.find((err, players) => {
    if (err) {
      return Promise.reject(err);
    }
    return Promise.resolve(players);
  });
};

const FootballPlayer = model("FootballPlayer", footballPlayerSchema);

export default FootballPlayer;

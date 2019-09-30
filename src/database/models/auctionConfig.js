
import { Schema, model } from "mongoose"

const auctionConfigSchema = new Schema(
  {
    auctionType: {
      type: String,
      enum: ["alphabetic", "call", "random"],
      required: true
    },
    footballPlayerStartingPrice: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message:
          "{VALUE} is not an integer value for footballPlayerStartingPrice"
      }
    },
    countdownSeconds: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value for countdownSeconds"
      }
    }
  },
  {
    timestamps: true
  }
);

// create the model out of the schema
const AuctionConfig = model("AuctionConfig", auctionConfigSchema);

// return the object to the caller when this file is imported
export default AuctionConfig;

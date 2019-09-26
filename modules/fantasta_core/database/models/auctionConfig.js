
import { Schema, model } from "mongoose"

const auctionConfig = new Schema(
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

//--------------------   auctionConfig methods   --------------------
// add a method to the schema (version 1)
auctionConfig.methods.mymethod = function() {
  console.log("mymethod called!");
};

// add a method to the schema (version 2)
auctionConfig.method("mymethod2", function() {
  console.log("mymethod2 called!");
});
//-------------------------------------------------------------------

// create the model out of the schema
const AuctionConfig = model("AuctionConfig", auctionConfig);

// return the object to the caller when this file is imported
export default AuctionConfig;

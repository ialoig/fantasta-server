const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    // createdAt: Date (default added by mongoose)
    // updatedAt: Date (default added by mongoose)
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
const AuctionConfig = mongoose.model("AuctionConfig", auctionConfig);

// return the object to the caller when this file is imported
module.exports = AuctionConfig;

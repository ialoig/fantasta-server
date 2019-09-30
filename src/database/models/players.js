
import { Schema, model } from "mongoose"

const playersSchema = new Schema(
    {
        players:
        {
            type: Object,
            required: true
        },
        version:
        {
            type: Number,
            required: true
        }
    },
    {
      timestamps: true
    }
);

//--------------------   auctionConfig methods   --------------------
playersSchema.statics.getAll = function () {
    return this.findOne(
        (err, players) =>
        {
            if (err)
            {
                return Promise.reject(err)
            }
            return Promise.resolve(players)
        }
    )
}
//-------------------------------------------------------------------

const Players = model("Players", playersSchema);

export default Players;

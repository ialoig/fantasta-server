import { Schema, model } from "mongoose";

const playersSchema = new Schema(
  {
    players: {
      type: Object,
      required: true,
    },
    version: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// -------------------------------------------------------------

playersSchema.statics.getAll = function () {
  return this.findOne((err, players) => {
    if (err) {
      return Promise.reject(err);
    }
    return Promise.resolve(players);
  });
};

// -------------------------------------------------------------

playersSchema.statics.getMostUpdatedVersion = function ()
{
    return this
        .findOne({}, null, {sort: {version: -1}}, (err, players) =>
        {
            if (err)
            {
                return Promise.reject(err)
            }
            return Promise.resolve(players)
        }
    )
}

// -------------------------------------------------------------

playersSchema.statics.deleteVersion = function(version)
{
    return this
        .deleteOne({version: version}, (err) => 
        {
            if (err)
            {
                return Promise.reject(err)
            }
            console.log(`version ${version} successfully deleted`);
        });
}
  

// -------------------------------------------------------------

const Players = model("Players", playersSchema);

export default Players;

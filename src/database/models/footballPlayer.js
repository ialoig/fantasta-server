import { Schema, model } from "mongoose";

const footballPlayersSchema = new Schema(
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

footballPlayersSchema.statics.getAll = function () {
  return this.findOne((err, players) => {
    if (err) {
      return Promise.reject(err);
    }
    return Promise.resolve(players);
  });
};

// -------------------------------------------------------------

footballPlayersSchema.statics.getMostUpdatedVersion = function ()
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

footballPlayersSchema.statics.deleteVersion = function(version)
{
    return this
        .deleteOne({version: version}, (err) => 
        {
            if (err)
            {
                return Promise.reject(err)
            }
            console.log(`===== FootballPlayer collection version ${version} successfully deleted`);
        });
}
  

// -------------------------------------------------------------

const FootballPlayers = model("FootballPlayers", footballPlayersSchema);

export default FootballPlayers;

import { Schema, model } from "mongoose";

const footballPlayersSchema = new Schema(
  {
    footballPlayers: {
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
  return this.findOne((err, footballPlayers) => {
    if (err) {
      return Promise.reject(err);
    }
    return Promise.resolve(footballPlayers);
  });
};

// -------------------------------------------------------------

footballPlayersSchema.statics.getMostUpdatedList = function ()
{
    return this
        .findOne({}, null, {sort: {version: -1}}, (err, footballPlayers) =>
        {
            if (err)
            {
                return Promise.reject(err)
            }
            return Promise.resolve(footballPlayers)
        }
    )
}

// -------------------------------------------------------------

footballPlayersSchema.statics.getVersion = function()
{
  return this
  .findOne({}, "version" , {sort: {version: -1}}, (err, footballPlayerVersion) =>
  {
      if (err)
      {
          return Promise.reject(err)
      }

      return Promise.resolve(footballPlayerVersion)
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

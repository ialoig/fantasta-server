import { Schema, model } from "mongoose";

/* Example
"footballPlayers": 
{
  "26": 
  {
    "id": 26,
    "name": "GOMEZ A",
    "team": "Atalanta",
    "roleClassic": "C",
    "roleMantra": ["T","A"],
    "actualPrice": 25,
    "initialPrice": 26
  },
  "226": 
  {
    "id": 226,
    "name": "IZZO",
    "team": "Torino",
    "roleClassic": "D",
    "roleMantra": ["Dd","Dc"],
    "actualPrice": 17,
    "initialPrice": 16
  },
  ...
  "version": 1
*/

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

footballPlayersSchema.statics.get = function () {
  return this.findOne((err, footballPlayers) => {
    if (err) {
      return Promise.reject(err);
    }
    return Promise.resolve(footballPlayers);
  });
};

// -------------------------------------------------------------

footballPlayersSchema.statics.delete = function () {
  return this.deleteMany({}, (err, status) => {
    if (err) {
      return Promise.reject(err);
    }
    return Promise.resolve(status);
  });
};

// -------------------------------------------------------------

const FootballPlayers = model("FootballPlayers", footballPlayersSchema);

export default FootballPlayers;

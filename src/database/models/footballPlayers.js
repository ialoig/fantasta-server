import mongoose from 'mongoose'
const { Schema, model } = mongoose

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
    list: {
      type: Object,
      required: true,
    },
    statistics: {
      type: Object,
      required: true,
    },
    version: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt automatically added by mongoose
  }
);

const FootballPlayers = model("FootballPlayers", footballPlayersSchema);

export default FootballPlayers;

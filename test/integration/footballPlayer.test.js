//"use strict";
// const mongoose = require('mongoose');

const FootballPlayer = require('../../src/database');
const containsCorrectData = require('../../src/footballPlayers');


const assert = require("assert");

const footballPlayerList_obj = {
  "1": {
    id: "1",
    name: "PIPPOTTO",
    team: "Roma",
    roleClassic: "P",
    roleMantra: ["Pc"],
    actualPrice: 25,
    initialPrice: 26
  },
  "2": {
    id: "2",
    name: "INKUBO",
    team: "Roma",
    roleClassic: "D",
    roleMantra: ["Dd","Dc"],
    actualPrice: 25,
    initialPrice: 26
  },
  "3": {
    id: "3",
    name: "BELOX",
    team: "Inter",
    roleClassic: "C",
    roleMantra: ["T","A"],
    actualPrice: 25,
    initialPrice: 26
  }
}

const footballPlayerList_obj_wrong_actualPrice = {
  "4": {
    id: "4",
    name: "ActualPrice wrong",
    team: "aaa",
    roleClassic: "P",
    roleMantra: ["Por"],
    actualPrice: -25,
    initialPrice: 26
  },
}

const footballPlayerList_obj_wrong_roleClassic = {
  "5": {
    id: "5",
    name: "roleClassic wrong",
    team: "aaa",
    roleClassic: "X",
    roleMantra: ["Por"],
    actualPrice: 25,
    initialPrice: 26
  },
}

const footballPlayerList_obj_wrong_roleMantra = {
  "6": {
    id: "6",
    name: "roleMantra wrong",
    team: "aaa",
    roleClassic: "P",
    roleMantra: ["Portiere"],
    actualPrice: 25,
    initialPrice: 26
  },
}


describe("Database", function() {
  //this.timeout(15000)

  // Drop users collection
  beforeEach(done => {
    try {
      FootballPlayer.delete();
    } catch (error) {
      console.error(error);
    }
    done();
  });

  it(`should be able to validate footballPlayerList_obj`, done => {
    
    for (const [footballPlayerId, footballPlayer_obj] of Object.entries(footballPlayerList_obj)) {
      assert.strictEqual(containsCorrectData(footballPlayer_obj), true)
    }
    done();
  });

  // Drop users collection
  after(done => {
    try {
      FootballPlayer.delete();
    } catch (error) {
      console.error(error);
    }
    done();
  });

  // Close connection
  after(done => {
    mongoose.connection.close();
    done();
  });
}); // end Database

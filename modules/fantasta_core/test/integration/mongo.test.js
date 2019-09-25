//"use strict";

const mongoose = require("mongoose");
const assert = require("assert");

var databaseManager;

const dropCollection = function(collectionName, done) {
  mongoose.connection.db
    .listCollections({ name: collectionName })
    .next(function(err, collinfo) {
      if (collinfo) {
        // collection exists => remove it
        mongoose.connection.dropCollection(collectionName, function( err, result ) {
          if (err) {
            console.log(`deleting collection '${collectionName}': failure`);
            console.log(err);
          } else {
            console.log(`deleting collection '${collectionName}': success`);
            done();
          }
        });
      }
      // collection does not exist => call callback
      else {
        console.log(`deleting collection'${collectionName}': collection does not exist`);
        done();
      }
    });
};

describe("Database", function() {
  //this.timeout(15000)

  // Establish connection
  before(done => {
    // start mongoose
    databaseManager = require("../database/databaseManager");
    mongoose.connection.once("connected", function() {
      console.log("mongodb status: connected");
      done();
    });
  });

  // Drop X collection
  before(done => {
    const collectionName = "X";
    dropCollection(collectionName, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        done();
      }
    });
  });

  // TEST 1: connection to mongodb
  it(`should be able to connect to mongodb`, done => {
    assert.equal(
      mongoose.connection.states.connected,
      mongoose.connection.readyState
    );
    done();
  });

  // Drop X collection
  after(done => {
    const collectionName = "X";
    dropCollection(collectionName, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        done();
      }
    });
  });

  // Close connection
  after(done => {
    mongoose.connection.close();
    done();
  });
}); // end Database

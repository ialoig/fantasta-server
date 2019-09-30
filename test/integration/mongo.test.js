//"use strict";
import mongoose from "mongoose";
import { Commons, User } from "database";

const assert = require("assert");

const dropCollection = function(collectionName, done) {
  mongoose.connection.db
    .listCollections({ name: collectionName })
    .next(function(err, collinfo) {
      if (collinfo) {
        // collection exists => remove it
        mongoose.connection.dropCollection(collectionName, function(
          err,
          result
        ) {
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
        console.log(
          `deleting collection'${collectionName}': collection does not exist`
        );
        done();
      }
    });
};

describe("Database", function() {
  //this.timeout(15000)

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

  // TEST 1: connection to mongodb established
  it(`should be able to connect to mongodb`, done => {
    assert.equal(
      mongoose.connection.states.connected,
      mongoose.connection.readyState
    );
    done();
  });

  // TEST 2: create User
  it(`should be able to create a User`, async function() {
    console.log("0000")
    const newUser = User({
      name: "user_name",
      email: "user_email",
      password: "user_password",
      uuid: "user_uuid",
      teams: []
    });
    console.log(JSON.stringify(newUser))
    console.log("1111")

    try {
      //let newUserResult = await Commons.save( newUser );
      let newUserResult = await Commons.save( newUser );
      console.log("3333");
      assert.equal(newUser.name, newUserResult.name);
      assert.equal(newUser.email, newUserResult.email);
      assert.equal(newUser.password, newUserResult.password);
      assert.equal(newUser.uuid, newUserResult.uuid);
      assert.equal(newUser.teams, newUserResult.teams);
      console.log("4444");
      assert.equal(false, newUser.isNew);
      done()
    } catch (err) {
      done();
    }

    /*
    newUser.save().then(() => {
      assert.equal(false, newUser.isNew);
      done();
    });
    */
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

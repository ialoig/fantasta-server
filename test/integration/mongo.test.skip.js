//"use strict";
// import mongoose from "mongoose";
const mongoose = require('src/mongoose');

// import { Commons, User } from 'src/database';
const Commons = require('src/database');
const User = require('src/database');

const dropCollection = function(collectionName, done) {
  connection.db
    .listCollections({ name: collectionName })
    .next(function(err, collinfo) {
      if (collinfo) {
        // collection exists => remove it
        connection.dropCollection(collectionName, function(
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

  // Drop users collection
  beforeEach(done => {
    dropCollection("users", function(err, result) {
      if (err) {
        console.log(err);
      } else {
        done();
      }
    });
  });

  // TEST 1: connection to mongodb established
  it(`should be able to connect to mongodb`, done => {
    equal(
      connection.states.connected,
      connection.readyState
    );
    done();
  });

  // TEST 2: create User
  it(`should be able to create a User`, function(done) {
    const newUser = User({
      name: "user_name",
      email: "user_email",
      password: "user_password",
      uuid: "user_uuid",
      teams: []
    });

    Commons.save(newUser).then(
      function(newUserResult) {
        equal(newUser.name, newUserResult.name);
        equal(newUser.email, newUserResult.email);
        equal(newUser.password, newUserResult.password);
        equal(newUser.uuid, newUserResult.uuid);
        equal(newUser.teams, newUserResult.teams);
        equal(false, newUser.isNew);
        done();
      },
      function(error) {
        done(error);
      }
    );
  });

  // Drop users collection
  after(done => {
    const collectionName = "users";
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
    connection.close();
    done();
  });
}); // end Database

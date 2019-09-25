

import mongoose, { connect, connection } from 'mongoose'
import config from 'config';

// use ES6 Promise instead of mongoose.Promise
mongoose.Promise = global.Promise;

// register callback on events
connection
  .on("connecting", function() {
    console.log("mongodb status: connecting");
  })
  .on("disconnecting", function() {
    console.log("mongodb status: disconnecting");
  })
  .on("disconnected", function() {
    console.log("mongodb status: disconnected");
  })
  .on("close", function() {
    console.log("mongodb status: connection close");
  })
  .on("error", console.error.bind(console, "mongodb connection error:"));

connection
  .once("connected", function() {
    console.log("mongodb status: connected");
  })

process.on("SIGINT", function() {
  connection.close(function() {
    console.log(
      "Mongoose default connection is disconnected due to application termination"
    );
    process.exit(0);
  });
});

const mongodbConnection = `${config.mongodb.endpoint}:${config.mongodb.port}/${config.mongodb.database}`
console.log(`mongodb endpoint: ${mongodbConnection}`);

const mongoConnectionParams = {
  useNewUrlParser: true, // MongoDB driver has deprecated their current connection string parser
  autoReconnect: true, // Reconnect on error (default true)
  reconnectTries: 10, // Server attempt to reconnect #times (default 30)
  reconnectInterval: 1000, // Server will wait # milliseconds between retries (default 1000)
  poolSize: 5, // Set the maximum poolSize for each individual server or proxy connection (default 5)
  autoIndex: false, // disabled in production since index creation can cause a significant performance impact (default: true?)
  useUnifiedTopology: true
};

connect(mongodbConnection, mongoConnectionParams);


const commons = require("./commons");

const DB = {
  commons
}

export default DB
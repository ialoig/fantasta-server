

import mongoose, { connect, connection } from 'mongoose'
import config from 'config'

import { default as populate } from './populate'

// use ES6 Promise instead of mongoose.Promise
mongoose.Promise = Promise

// register callback on events
connection
.on( 'connecting', () => {
    console.log("mongodb status: connecting")
})
.on( 'disconnecting', () => {
    console.log("mongodb status: disconnecting")
})
.on( 'disconnected', () => {
    console.log("mongodb status: disconnected")
})
.on( 'close', () => {
    console.log("mongodb status: connection close")
})
.on( 'error', (error) => {
    console.error("ERROR: ", error)
})

connection
.once( 'connected', () => {
    console.log("mongodb status: connected")
})

process.on( 'SIGINT', () => {
    connection.close( () => {
        console.log( "Mongoose default connection is disconnected due to application termination" )
        process.exit(0)
    })
})

const mongodbConnection = `${config.mongodb.endpoint}:${config.mongodb.port}/${config.mongodb.database}`
console.log( `mongodb endpoint: ${mongodbConnection}`)

const mongoConnectionParams = {
    useNewUrlParser: true, // MongoDB driver has deprecated their current connection string parser
    // autoReconnect: true, // Reconnect on error (default true)
    // reconnectTries: 10, // Server attempt to reconnect #times (default 30)
    // reconnectInterval: 1000, // Server will wait # milliseconds between retries (default 1000)
    poolSize: 5, // Set the maximum poolSize for each individual server or proxy connection (default 5)
    autoIndex: false, // disabled in production since index creation can cause a significant performance impact (default: true?)
    useUnifiedTopology: true
}

connect( mongodbConnection, mongoConnectionParams )

export { League, FootballPlayer, Team, User } from './models'
export { populate }

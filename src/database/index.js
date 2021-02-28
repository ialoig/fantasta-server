

import mongoose from 'mongoose'
import config from 'config'

import { savePlayers } from '../footballPlayers'
import { default as populate } from './populate'

// use ES6 Promise instead of mongoose.Promise
mongoose.Promise = Promise

const mongodbConnection = `${config.mongodb.endpoint}:${config.mongodb.port}/${config.mongodb.database}`

const mongoConnectionParams = {
    useNewUrlParser: true,    // MongoDB driver has deprecated their current connection string parser
    useUnifiedTopology: true,
    poolSize: 5,              // Set the maximum poolSize for each individual server or proxy connection (default 5)
    autoIndex: false,         // disabled in production since index creation can cause a significant performance impact (default: true?)
}

/**
 * 
 * @param {*} startServer callback function to execute once mongo connection is established
 */
const initMongoConnection = () => {

    console.log( `[mongodb] endpoint: ${mongodbConnection}`)
    
    // connect to mongo
    mongoose.connect(mongodbConnection, mongoConnectionParams)

    // register callback on mongo connection events
    let connection = mongoose.connection
    connection.on('connecting', () => { console.log("[mongodb] status: connecting") })
    connection.on('connected', function () { console.log("[mongodb] status: connected") })
    connection.on('disconnecting', () => { console.log("[mongodb] status: disconnecting")} )
    connection.on('disconnected', () => { console.log("[mongodb] status: disconnected")} )
    connection.on('reconnected', () => { console.log('[mongodb] status: reconnected')} )
    connection.on('close', () => { console.log("[mongodb] status: connection closed")} )
    connection.on('fullsetup', () => { console.log("[mongodb] status: fullsetup")} )

    connection.on('error', (error) => {
        console.error(`[mongodb] status: error. ${error}`)
        process.exit(1) // fail application
    })

    connection.on('open', () => {
        console.log("[mongodb] status: open")
        savePlayers()
    })
}

process.on( 'SIGINT', () => {
    connection.close( () => {
        console.log( "Mongoose default connection is disconnected due to application termination" )
        process.exit(0)
    })
})

initMongoConnection()

export { League, FootballPlayer, Team, User } from './models'
export { populate }
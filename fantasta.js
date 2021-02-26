import express from 'express'
import path from 'path'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import config from 'config'
import { initMongoConnection } from './src/database'
import { JobSchedule, savePlayers } from './src/footballPlayers'
import { seed } from "./test/seed" // for development only

let app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(morgan('dev')) //'combined'
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))


// ------------------------------
// ???
app.use( (req, res, next) => {
    res.header("Accept", "*")
    res.header("Access-Control-Allow-Origin", "http://localhost:19006")
    res.header("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Language, language, Accept-Encoding, X-CSRF-Token, Authorization, Origin, X-Requested-With, Access-Control-Allow-Origin, access-control-allow-credentials, access-control-allow-headers, access-control-allow-methods, ")
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET")
    res.header("Access-Control-Allow-Credentials", true)
    next()
})

// ------------------------------------------------------------
// Error Handling
app.use( (err, req, res, next) => {
    console.error("!!!!!!!!!!!!!!!!!");
    console.error("An error occurred");
    console.error(`request: ${req}`);
    console.error(`error: ${err.stack}`);
    console.error("!!!!!!!!!!!!!!!!!");
    res.status(err.status || 500)
    res.render('error')
})

// ------------------------------------------------------------
// Setting HTTP routes
let routes = require('./src/routes').default
app.use('/fantasta', routes)


// ------------------------------------------------------------
// Start Server
const startServer = () => {

    // Create socket
    const SocketInit = require('./src/socket').init
    const server = SocketInit( app )

    server.listen( config.port, () => {
        console.log(`************************************`)
        console.log(`Environment: ${process.env.NODE_ENV}`)
        console.log(`Config: ${JSON.stringify(config, null, 2)}`)
        console.log(`************************************`)
        console.log(`Fantasta Server running on port ${config.port}`)
        console.log(`************************************`)
    })
}

const startServicesCallback = () => {

    startServer()

    // populate db with football players
    savePlayers()

    // Scheduling processes
    JobSchedule()

    // Seed database with fake data
    // seed()
}

initMongoConnection(startServicesCallback)

module.exports = app

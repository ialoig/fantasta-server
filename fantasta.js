
let express = require('express')
let path = require('path')
let favicon = require('serve-favicon')
let morgan = require('morgan')
let http = require('http')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let config = require('config')
let socket = require('socket.io')

let app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(morgan('dev')) //'combined'
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')))


// ------------------------------
// ???
app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept")
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
// Scheduling processes
let saveFootballPlayers = require('./src/footballPlayers').saveFootballPlayers
saveFootballPlayers(config.schedule.excelFilenameClassic, config.schedule.excelFilenameMantra) 


// ------------------------------------------------------------
// Setting HTTP routes
let routes = require('./src/routes').default
app.use('/fantasta', routes)


// ------------------------------------------------------------
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

module.exports = app

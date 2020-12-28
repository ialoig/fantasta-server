
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

app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET")
    res.header("Access-Control-Allow-Credentials", true)
    next()
})

app.use( (req, res, next) => {
    let err = new Error('Not Found')
    err.status = 404
    next(err)
})

app.use( (err, req, res, next) => {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    res.status(err.status || 500)
    res.render('error')
})

/* ----- SCHEDULING PROCESS ----- */
let SavePlayersJson = require('./src/players').savePlayersJson
SavePlayersJson()

/* ----- SETTING API ROUTES ----- */
let routes = require('./src/routes').default
app.use('/fantasta', routes)

/* ----- CREATING SOCKET PUB/SUB ----- */
const SocketInit = require('./src/socket').init
const server = SocketInit( app )

const port = process.env.PORT || config.port
server.listen( port, () => {
    console.log(`// ***** FANTA ASTA SERVER ***** \\\\`)
    console.log(`// Server environment: ` + process.env.NODE_ENV + ' \\\\' )
    console.log(`// Server started on port <${port}> \\\\`)
})

module.exports = app

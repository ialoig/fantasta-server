import path from "path"
import config from "config"
import cookieParser from "cookie-parser"
import express from "express"
import morgan from "morgan"
import { initMongoConnection } from "./database"
import routing  from "./routes"
import { init } from "./socket"

let app = express()

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

app.use(morgan("dev")) //'combined'
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

// Headers da accettare per le chiamate esterne
app.use( (req, res, next) => {
	res.header("Accept", "*")
	res.header("Access-Control-Allow-Origin", "http://localhost:19006")
	res.header("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Language, language, Accept-Encoding, X-CSRF-Token, Authorization, Origin, X-Requested-With, Access-Control-Allow-Origin, access-control-allow-credentials, access-control-allow-headers, access-control-allow-methods, ")
	res.header("Access-Control-Allow-Methods", "POST, PUT, GET")
	res.header("Access-Control-Allow-Credentials", true)
	next()
})

// Error Handling
// eslint disabled for 'next' params - it has to be defined even if not used
// eslint-disable-next-line no-unused-vars
app.use( (err, req, res, next) => {
	console.error("!!!!!!!!!!!!!!!!!")
	console.error("An error occurred")
	console.error(`request: ${req}`)
	console.error(`error: ${err.stack}`)
	console.error("!!!!!!!!!!!!!!!!!")
	res.status(err.status || 500)
	res.render("error")
})

// Setting HTTP routes
app.use("/fantasta", routing)

// Start MongoDB service
initMongoConnection()

// Start Server
const server = init( app )
server.listen( config.port, () => {
	console.log("************************************")
	console.log(`Environment: ${process.env.NODE_ENV}`)
	console.log(`Config: ${JSON.stringify(config, null, 2)}`)
	console.log("************************************")
	console.log(`Fantasta Server running on port ${config.port}`)
	console.log("************************************")
})

export default server

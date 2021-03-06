import config from "config"
import mongoose from "mongoose"
import { downloadPlayers } from "../footballPlayers"
import { mongodb_connection_status_counter } from "../metrics"
import { seed } from "../seed" // for development only
import { User } from "./models"
import { default as populate } from "./populate.js"

// use ES6 Promise instead of mongoose.Promise
mongoose.Promise = Promise

const deletedUserObj = {
	email: "deletedUser@email.com",
	password: "deletedUserPassword",
	username: "deleted user"
}

const createDeletedUser = async () => {
	let deletedUserResult = await User.findOne({ email: deletedUserObj.email })
	if (!deletedUserResult) {
		console.log("[createDeletedUser] deletedUser creation")
		deletedUserResult = await User.create(deletedUserObj)
	}
	else {
		console.log("[createDeletedUser] skip deletedUser creation")
	}
	console.log(`deletedUserObj: ${JSON.stringify(deletedUserObj, null, 2)}`)
}

const mongodbConnection = `${config.mongodb.endpoint}:${config.mongodb.port}/${config.mongodb.database}`

const mongoConnectionParams = {
	useNewUrlParser: true,    // MongoDB driver has deprecated their current connection string parser
	useUnifiedTopology: true,
	useCreateIndex: true,
	autoIndex: true         // disabled in production since index creation can cause a significant performance impact (default: true?)
}

const initMongoConnection = async (trigger_download = true) => {

	console.log(`[mongodb] endpoint: ${mongodbConnection}`)

	// connect to mongo
	mongoose.connect(mongodbConnection, mongoConnectionParams)

	// register callback on mongo connection events
	let connection = mongoose.connection
	connection.on("connecting", () => {
		console.log("[mongodb] status: connecting")
		mongodb_connection_status_counter.inc({ status: "connecting" })
	})
	connection.on("connected", function () {
		console.log("[mongodb] status: connected")
		mongodb_connection_status_counter.inc({ status: "connected" })
	})
	connection.on("disconnecting", () => {
		console.log("[mongodb] status: disconnecting")
		mongodb_connection_status_counter.inc({ status: "disconnecting" })
	})
	connection.on("disconnected", () => {
		console.log("[mongodb] status: disconnected")
		mongodb_connection_status_counter.inc({ status: "disconnected" })
	})
	connection.on("reconnected", () => {
		console.log("[mongodb] status: reconnected")
		mongodb_connection_status_counter.inc({ status: "reconnected" })
	})
	connection.on("close", () => {
		console.log("[mongodb] status: close")
		mongodb_connection_status_counter.inc({ status: "close" })
	})
	connection.on("fullsetup", () => {
		console.log("[mongodb] status: fullsetup")
		mongodb_connection_status_counter.inc({ status: "fullsetup" })
	})

	connection.on("error", (error) => {
		console.error(`[mongodb] status: error. ${error}`)
		mongodb_connection_status_counter.inc({ status: "error" })
		process.exit(1) // fail application
	})

	connection.on("open", async () => {
		console.log("[mongodb] status: open")
		mongodb_connection_status_counter.inc({ status: "open" })

		await createDeletedUser()

		if (trigger_download)
			downloadPlayers()

		// Seed database with fake data
		if (process.env.NODE_ENV == "dev") {
			seed()
		}
	})

	process.on("SIGINT", () => {
		connection.close(() => {
			console.log("[mongodb] Received SIGINT - Mongoose default connection is disconnected due to application termination")
			process.exit(0)
		})
	})
}


export { League, FootballPlayers, Team, User, Reset, Market } from "./models"
export { initMongoConnection, populate }
export { deletedUserObj }

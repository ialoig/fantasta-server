import { equal } from "joi"
import { after, beforeEach, describe, it } from "mocha"
import mongoose from "mongoose"
import { User } from "../../src/database"

let connection = mongoose.connection

const dropCollection = (collectionName, done) => {
	connection.db
		.listCollections({ name: collectionName })
		.next((err, collinfo) => {
			if (collinfo) {
				// collection exists => remove it
				connection.dropCollection(collectionName, (err) => {
					if (err) {
						console.log(`deleting collection '${collectionName}': failure`)
						console.log(err)
					} else {
						console.log(`deleting collection '${collectionName}': success`)
						done()
					}
				})
			}
			// collection does not exist => call callback
			else {
				console.log(
					`deleting collection'${collectionName}': collection does not exist`
				)
				done()
			}
		})
}

describe("Database", () => {
	//this.timeout(15000)

	// Drop users collection
	beforeEach(done => {
		dropCollection("users", (err) => {
			if (err) {
				console.log(err)
			} else {
				done()
			}
		})
	})

	// TEST 1: connection to mongodb established
	it("should be able to connect to mongodb", done => {
		equal(
			connection.states.connected,
			connection.readyState
		)
		done()
	})

	// TEST 2: create User
	it("should be able to create a User", (done) => {
		const newUser = User.create({
			username: "user_name",
			email: "user_email",
			password: "user_password",
			uuid: "user_uuid",
			teams: []
		}).then((newUserResult) => {
			equal(newUser.name, newUserResult.name)
			equal(newUser.email, newUserResult.email)
			equal(newUser.password, newUserResult.password)
			equal(newUser.uuid, newUserResult.uuid)
			equal(newUser.teams, newUserResult.teams)
			equal(false, newUser.isNew)
			done()
		}, (error) => {
			done(error)
		})
	})

	// Drop users collection
	after(done => {
		const collectionName = "users"
		dropCollection(collectionName, (err) => {
			if (err) {
				console.log(err)
			} else {
				done()
			}
		})
	})

	// Close connection
	after(done => {
		connection.close()
		done()
	})
}) // end Database

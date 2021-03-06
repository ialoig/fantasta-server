/* eslint-disable no-prototype-builtins */
import { request, use } from "chai"
import chaiHttp from "chai-http"
import config from "config"
import { initMongoConnection } from "../../src/database/index.js"

const serverUrl = config.serverUrl || "http://localhost:3000"

use(chaiHttp)

initMongoConnection(false)

export const requester = request(serverUrl)


/**
 * Prints a Json object with a custom message
 * @param {*} msg : message to print
 * @param {*} obj : object to print
 */
export const printObject = (msg, obj) => {
	console.log("---------------------------------------")
	console.log(`${msg}: ${JSON.stringify(obj, null, 2)}`)
	console.log("---------------------------------------")
}

/**
 * Recursive function to look for a specific value of a property in a nested object (NOTE: an array is an object)
 * @param {*} obj      : object to parse
 * @param {*} property : property to be looked up
 * @param {*} value    : expected value for property
 */
export const findPropertyValueInNestedObject = (obj, property, value) => {
	if (obj[property] === value) {
		return true
	}

	let found = false
	let prop
	for (prop in obj) {
		if (obj.hasOwnProperty(prop) && typeof obj[prop] === "object") {
			found = findPropertyValueInNestedObject(obj[prop], property, value)
			if (found) {
				return found
			}
		}
	}
	return found
}

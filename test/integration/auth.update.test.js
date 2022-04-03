import { expect, should, use } from "chai"
import chaiHttp from "chai-http"
import config from "config"
import { after, before, describe, it } from "mocha"
import { User } from "../../src/database"
import { Errors, tokenUtils } from "../../src/utils"
import { requester } from "./index"

use(chaiHttp)
should()

const api = "/fantasta/auth/update"

const test_user = { 
	email: "test@test.com", 
	password: "123456", 
	username: "username"
}

describe("UPDATE", () => {

	before(async () => {

		// Clean DB
		await User.deleteMany()
		await User.create(test_user)
	})

	after( async () => {
		requester.close()
	})

	it("Body is undefined", async () => {
		const res = await requester.put(api).send(undefined)
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
		expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
	})

	it("Body is empty", async () => {
		const res = await requester.put(api).send({})
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
		expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
	})

	it("Email is NULL", async () => {
		const res = await requester.put(api).send({ email: null })
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
		expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
	})

	it("Email is NOT VALID", async () => {
		const res = await requester.put(api).send({ email: "blabla" })
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
		expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
	})

	it("Email is CORRECT", async () => {
		const token = tokenUtils.Create(config.token.kid, "test@test.com", "123456", "username")
		const res = await requester.put(api).set("Authorization", token).send({ email: "test@test.it" })
		expect(res).to.have.status(200)
		expect(res.body).to.be.a("object")
		expect(res.body.user).to.be.a("object").that.is.not.empty
		expect(res.body.user.email).to.equal("test@test.it")
		expect(res.body.token).to.be.a("string")
	})

	it("Password is NULL", async () => {
		const res = await requester.put(api).send({ password: null })
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
		expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
	})

	it("Password is NOT VALID", async () => {
		const res = await requester.put(api).send({ password: "226" })
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
		expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
	})

	it("Password is CORRECT", async () => {
		const token = tokenUtils.Create(config.token.kid, "test@test.it", "123456", "username")
		const res = await requester.put(api).set("Authorization", token).send({ password: "654321" })
		expect(res).to.have.status(200)
		expect(res.body).to.be.a("object")
		expect(res.body.user).to.be.a("object").that.is.not.empty
		expect(res.body.user.email).to.equal("test@test.it")
		expect(res.body.token).to.be.a("string")
	})

	it("Username is NULL", async () => {
		const res = await requester.put(api).send({ username: null })
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
		expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
	})

	it("Username is NOT CORRECT", async () => {
		const res = await requester.put(api).send({ username: "" })
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
		expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
	})

	it("Username is CORRECT", async () => {
		const token = tokenUtils.Create(config.token.kid, "test@test.it", "654321", "username")
		const res = await requester.put(api).set("Authorization", token).send({ username: "user" })
		expect(res).to.have.status(200)
		expect(res.body).to.be.a("object")
		expect(res.body.user).to.be.a("object").that.is.not.empty
		expect(res.body.user.username).to.equal("user")
		expect(res.body.token).to.be.a("string")
	})
})

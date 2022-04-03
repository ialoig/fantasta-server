
import { expect, should, use } from "chai"
import chaiHttp from "chai-http"
import config from "config"
import { after, beforeEach, describe, it } from "mocha"
import { User } from "../../src/database/index.js"
import { Errors, tokenUtils } from "../../src/utils/index.js"
import { printObject, requester } from "./index.js"

use(chaiHttp)
should()

const api = "/fantasta/auth/token"

describe("TOKEN", () => {
	beforeEach( async () => {

		// Clean DB
		await User.deleteMany()
	})

	after( async () => {
		requester.close()
		
		// Clean DB
		await User.deleteMany()
	})

	it("Token is NULL", async () => {
		const res = await requester.put(api).set("Authorization", null)
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.TOKEN_NOT_VALID.code)
		expect(res.body.status).to.equal(Errors.TOKEN_NOT_VALID.status)
	})

	it("Token is NOT CORRECT", async () => {
		let token = "wejhjksdhgkjlhdjkgrsdfjhkhsjkfdfghjkdfdghjkjfkg"
		const res = await requester.put(api).set("Authorization", token)
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.TOKEN_NOT_VALID.code)
		expect(res.body.status).to.equal(Errors.TOKEN_NOT_VALID.status)
	})

	it("Token is CORRECT but USER NOT PRESENT", async () => {
		const test_user = {
			email: "test_1@test.com",
			password: "123456",
			username: "username"
		}
		let token = tokenUtils.Create(config.token.kid, test_user.email, test_user.password, test_user.username)
		const res = await requester.put(api).set("Authorization", token)
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.EMAIL_NOT_FOUND.code)
		expect(res.body.status).to.equal(Errors.EMAIL_NOT_FOUND.status)

	})

	it("USER IS PRESENT --> Name and password are CORRECT", async () => {
		const test_user = {
			email: "test_1@test.com",
			password: "123456",
			username: "username"
		}
		const resRegister = await requester.post("/fantasta/auth/register").send({ email: test_user.email, password: test_user.password })
		const res = await requester.put(api).set("Authorization", resRegister.body.token)
		expect(res).to.have.status(200)
		expect(res.body).to.be.a("object").that.is.not.empty
		expect(res.body.user).to.be.a("object").that.is.not.empty
		expect(res.body.token).to.be.a("string")
	})

	it("USER IS PRESENT --> Name is CORRECT and password is INCORRECT", async () => {
		const test_user = {
			email: "test_1@test.com",
			password: "123456",
			username: "username"
		}
		await requester.post("/fantasta/auth/register").send({ email: test_user.email, password: test_user.password })	
		let token = tokenUtils.Create(config.token.kid, test_user.email, "654321", test_user.username)
		const res = await requester.put(api).set("Authorization", token)
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.WRONG_PASSWORD.code)
		expect(res.body.status).to.equal(Errors.WRONG_PASSWORD.status)
	})
})

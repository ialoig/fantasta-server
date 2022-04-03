import { expect, should, use } from "chai"
import chaiHttp from "chai-http"
import { after, beforeEach, describe, it } from "mocha"
import { User } from "../../src/database/index.js"
import { Errors } from "../../src/utils/index.js"
import { requester } from "./index.js"

use(chaiHttp)
should()

const api = "/fantasta/auth/register"

describe("REGISTER", () => {
	
	beforeEach( async () => {

		// Clean DB
		await User.deleteMany()
	})

	after( async () => {
		requester.close()
		
		// Clean DB
		await User.deleteMany()
	})

	it("Body is undefined", async () => {
		const res = await requester.post(api).send(undefined)
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.EMAIL_ERROR.code)
		expect(res.body.status).to.equal(Errors.EMAIL_ERROR.status)
	})

	it("Body is empty", async () => {
		const res = await requester.post(api).send({})
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.EMAIL_ERROR.code)
		expect(res.body.status).to.equal(Errors.EMAIL_ERROR.status)
	})

	it("Email is NULL", async () => {
		const test_user = { 
			email: null, 
			password: "123456", 
			username: "username" 
		}
		const res = await requester.post(api).send({ email: test_user.email, password: test_user.password })
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.EMAIL_ERROR.code)
		expect(res.body.status).to.equal(Errors.EMAIL_ERROR.status)
	})

	it("Email is NOT VALID", async () => {
		const test_user = { 
			email: "blabla", 
			password: "123456", 
			username: "username" 
		}
		const res = await requester.post(api).send({ email: test_user.email, password: test_user.password })
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.EMAIL_ERROR.code)
		expect(res.body.status).to.equal(Errors.EMAIL_ERROR.status)
	})

	it("Password is NULL", async () => {
		const test_user = { 
			email: "test@test.com", 
			password: null, 
			username: "username" 
		}
		const res = await requester.post(api).send({ email: test_user.email, password: test_user.password })
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.PASSWORD_ERROR.code)
		expect(res.body.status).to.equal(Errors.PASSWORD_ERROR.status)
	})

	it("Password is NOT VALID", async () => {
		const test_user = { 
			email: "test@test.com", 
			password: "226", 
			username: "username" 
		}
		const res = await requester.post(api).send({ email: test_user.email, password: test_user.password })
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.PASSWORD_ERROR.code)
		expect(res.body.status).to.equal(Errors.PASSWORD_ERROR.status)
	})

	it("Email and password are CORRECT but USER IS PRESENT", async () => {
		const test_user = { 
			email: "test@test.com", 
			password: "123456", 
			username: "username" 
		}
		await requester.post(api).send({ email: test_user.email, password: test_user.password })
		const res = await requester.post(api).send({ email: test_user.email, password: test_user.password })
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.EMAIL_ALREADY_EXISTS.code)
		expect(res.body.status).to.equal(Errors.EMAIL_ALREADY_EXISTS.status)
	})
	it("REGISTRATION OK --> Email and password are CORRECT", async () => {
		const test_user = { 
			email: "test@test.com", 
			password: "123456", 
			username: "username" 
		}
		const res = await requester.post(api).send({ email: test_user.email, password: test_user.password })
		expect(res).to.have.status(200)
		expect(res.body).to.be.a("object").that.is.not.empty
		expect(res.body.user).to.be.a("object").that.is.not.empty
		expect(res.body.token).to.be.a("string")
	})
})

import { expect, should, use } from "chai"
import chaiHttp from "chai-http"
import { after, before, describe, it } from "mocha"
import { User } from "../../src/database/index.js"
import { Errors } from "../../src/utils/index.js"
import { printObject, requester } from "./index.js"

use(chaiHttp)
should()

const api = "/fantasta/auth/forgot"

describe("FORGOT", () => {

	before( async () => {

		// Clean DB
		await User.deleteMany()
	})

	after( async () => {
		requester.close()

		// Clean DB
		await User.deleteMany()
	})

	it("Body is undefined", async () => {
		const res = await requester.put("/fantasta/auth/forgot").send(undefined)
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.EMAIL_ERROR.code)
		expect(res.body.status).to.equal(Errors.EMAIL_ERROR.status)
	})

	it("Body is empty", async () => {
		const res = await requester.put("/fantasta/auth/forgot").send({})
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.EMAIL_ERROR.code)
		expect(res.body.status).to.equal(Errors.EMAIL_ERROR.status)
	})

	it("Email is NULL", async () => {
		const res = await requester.put("/fantasta/auth/forgot").send({ email: null })
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.EMAIL_ERROR.code)
		expect(res.body.status).to.equal(Errors.EMAIL_ERROR.status)
	})

	it("Email is NOT VALID", async () => {
		const res = await requester.put("/fantasta/auth/forgot").send({ email: "asdgsdfgdsfg" })
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.EMAIL_ERROR.code)
		expect(res.body.status).to.equal(Errors.EMAIL_ERROR.status)
	})

	it("Email is VALID but NOT FOUND", async () => {
		const res = await requester.put("/fantasta/auth/forgot").send({ email: "test@test.com" })			
		expect(res).to.have.status(200)
		expect(res.body).to.be.a("object")
	})

	it("Email is CORRECT", async () => {
		const test_user_1 = { 
			email: "test@test.com",
			password: "123456",
			username: "username"
		}

		let test_user_1_db = await User.create(test_user_1)
		printObject("test_user_1_db", test_user_1_db)
		const res = await requester.put(api).send({ email: test_user_1.email })

		printObject("res", res)

		expect(res).to.have.status(200)
		expect(res.body).to.be.a("object")
	})
})


import { expect, should, use } from "chai"
import chaiHttp from "chai-http"
import config from "config"
import { after, before, describe, it } from "mocha"
import { User } from "../../src/database"
import { Errors, tokenUtils } from "../../src/utils"
import { printObject, requester } from "./index"

use(chaiHttp)
should()

const api = "/fantasta/support"

describe("Support", () => {

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
		const res = await requester.post(api).send(undefined)
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
		expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
	})

	it("Body is empty", async () => {
		const res = await requester.post(api).send({})
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
		expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
	})

	it("Text is NULL", async () => {
		const res = await requester.post(api).send({ text: null })
		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
		expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
	})

	it("Token is VALID", async () => {
		const test_user_1 = { 
			email: "test@test.com", 
			password: "123456", 
			username: "username" 
		}

		const token_1 = tokenUtils.Create(
			config.token.kid,
			test_user_1.email, 
			test_user_1.password, 
			test_user_1.username
		)

		await User.create(test_user_1)

		const res = await requester.post(api).set("Authorization", token_1).send({ text: "your app is amazing!!", email: test_user_1.email })
		printObject("res", res)

		expect(res).to.have.status(200)
		expect(res.body).to.be.a("object")
	})
})

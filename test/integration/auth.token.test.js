
import { expect, should, use } from "chai"
import chaiHttp from "chai-http"
import config from "config"
import { after, beforeEach, describe, it } from "mocha"
import { User } from "../../src/database/index.js"
import { Errors, tokenUtils } from "../../src/utils/index.js"
import { requester } from "./index.js"

use(chaiHttp)
should()

describe("TOKEN", () => {
	beforeEach((done) => {
		User.deleteMany({}, () => {
			done()
		})
	})

	after(() => {
		requester.close()
	})

	it("Token is NULL", (done) => {
		requester.put("/fantasta/auth/token")
			.set("Authorization", null)
			.end((err, res) => {
				expect(res).to.have.status(400)
				expect(res.body).to.be.a("object")
				expect(res.body.code).to.equal(Errors.TOKEN_NOT_VALID.code)
				expect(res.body.status).to.equal(Errors.TOKEN_NOT_VALID.status)
				done()
			})
	})

	it("Token is NOT CORRECT", (done) => {
		let token = "wejhjksdhgkjlhdjkgrsdfjhkhsjkfdfghjkdfdghjkjfkg"

		requester.put("/fantasta/auth/token")
			.set("Authorization", token)
			.end((err, res) => {
				expect(res).to.have.status(400)
				expect(res.body).to.be.a("object")
				expect(res.body.code).to.equal(Errors.TOKEN_NOT_VALID.code)
				expect(res.body.status).to.equal(Errors.TOKEN_NOT_VALID.status)
				done()
			})
	})

	it("Token is CORRECT but USER NOT PRESENT", (done) => {
		let token = tokenUtils.Create(config.token.kid, "test@test.com", "123456", "username")
		User.deleteMany({}, () => {
			requester.put("/fantasta/auth/token")
				.set("Authorization", token)
				.end((err, res) => {
					expect(res).to.have.status(400)
					expect(res.body).to.be.a("object")
					expect(res.body.code).to.equal(Errors.EMAIL_NOT_FOUND.code)
					expect(res.body.status).to.equal(Errors.EMAIL_NOT_FOUND.status)
					done()
				})
		})
	})

	it("USER IS PRESENT --> Name and password are CORRECT", (done) => {
		requester.post("/fantasta/auth/register")
			.send({ email: "test@test.com", password: "123456" })
			.end((err, res) => {

				requester.put("/fantasta/auth/token")
					.set("Authorization", res.body.token)
					.end((err, res) => {
						expect(res).to.have.status(200)
						expect(res.body).to.be.a("object").that.is.not.empty
						expect(res.body.user).to.be.a("object").that.is.not.empty
						expect(res.body.token).to.be.a("string")
						done()
					})
			})
	})

	it("USER IS PRESENT --> Name is CORRECT and password is INCORRECT", (done) => {
		requester.post("/fantasta/auth/register")
			.send({ email: "test@test.com", password: "123456" })
			.end(() => {
				let token = tokenUtils.Create(config.token.kid, "test@test.com", "654321", "test@test.com")
				requester.put("/fantasta/auth/token")
					.send({ token: token })
					.end((err, res) => {
						expect(res).to.have.status(400)
						expect(res.body).to.be.a("object")
						expect(res.body.code).to.equal(Errors.TOKEN_NOT_VALID.code)    //todo: why not PASSWORD_ERROR?
						expect(res.body.status).to.equal(Errors.TOKEN_NOT_VALID.status) //todo: why not PASSWORD_ERROR?
						done()
					})
			})
	})
})

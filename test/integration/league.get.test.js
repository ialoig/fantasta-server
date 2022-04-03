import { expect, should, use } from "chai"
import chaiHttp from "chai-http"
import config from "config"
import { after, before, describe, it } from "mocha"
import mongoose from "mongoose"
import { League, Team, User } from "../../src/database/index.js"
import { Errors, tokenUtils } from "../../src/utils/index.js"
import { requester } from "./index.js"

use(chaiHttp)
should()

const api = "/fantasta/league/get"

const test_user_1 = {
	//_id: it will be added once the User is created
	//leagues: it will be added once the League is created
	email: "test_1@test.com",
	password: "password_1",
	username: "username_1"
}
const token_1 = tokenUtils.Create(
	config.token.kid,
	test_user_1.email, 
	test_user_1.password, 
	test_user_1.username
)

const test_user_2 = {
	//_id: it will be added once the user is created
	email: "test_2@test.com",
	password: "password_2",
	username: "username_2"
}
const token_2 = tokenUtils.Create(
	config.token.kid,
	test_user_2.email, 
	test_user_2.password, 
	test_user_2.username
)

const classic_league_data = {
	name: "league_1",
	password: "league_1_password",
	participants: 2,
	type: "classic",
	goalkeepers: 1,
	defenders: 4,
	midfielders: 4,
	strikers: 2,
	players: 10,      // it will be set to 0 by the validation
	budget: 11,
	countdown: 3,
	auctionType: "call",
	startPrice: "zero",
	teamname: "team_name_1",
	status: "new"
}

describe("LEAGUE.GET", () => {

	before( async () => {

		// Clean DB
		await User.deleteMany()
		await League.deleteMany()
		await Team.deleteMany()
	})

	after( async () => {
		requester.close()

		// Clean DB
		await User.deleteMany()
		await League.deleteMany()
		await Team.deleteMany()
	})

	it("leagueID is undefined", async () => {
		const res = await requester.get(api)

		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
		expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
	})

	it("leagueID is empty", async () => {
		const res = await requester.get(api).query({ leagueID: "" })

		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
		expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
	})

	it("leagueID is NULL", async () => {
		const res = await requester.get(api).query({ leagueID: null })

		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.PARAMS_ERROR.code)
		expect(res.body.status).to.equal(Errors.PARAMS_ERROR.status)
	})

	it("League is PRESENT", async () => {

		// Create user
		let test_user_1_db = await User.create(test_user_1)

		// Create League
		classic_league_data.admin = test_user_1_db._id
		const classic_league_data_db = await League.create(classic_league_data)

		// Add League to User
		test_user_1_db.leagues.push(classic_league_data_db._id)
		await test_user_1_db.save()

		const res = await requester.get(api).set("Authorization", token_1).query({ leagueID: classic_league_data_db._id.toString() })

		expect(res).to.have.status(200)
		expect(res.body).to.be.a("object")
		expect(res.body.user._id).to.equal(test_user_1_db._id.toString())
		expect(res.body.user.email).to.equal(test_user_1.email.toString())
		expect(res.body.user.password).to.equal(undefined)
		expect(res.body.user.username).to.equal(test_user_1.username.toString())

		expect(res.body.league._id).to.equal(classic_league_data_db._id.toString())
		expect(res.body.league.name).to.equal(classic_league_data.name)
		expect(res.body.league.password).to.equal(classic_league_data.password)
		expect(res.body.league.participants).to.equal(classic_league_data.participants)
		expect(res.body.league.type).to.equal(classic_league_data.type)
		expect(res.body.league.goalkeepers).to.equal(classic_league_data.goalkeepers)
		expect(res.body.league.midfielders).to.equal(classic_league_data.midfielders)
		expect(res.body.league.strikers).to.equal(classic_league_data.strikers)
		expect(res.body.league.players).to.equal(classic_league_data.players)
		expect(res.body.league.budget).to.equal(classic_league_data.budget)
		expect(res.body.league.countdown).to.equal(classic_league_data.countdown)
		expect(res.body.league.auctionType).to.equal(classic_league_data.auctionType)
		expect(res.body.league.startPrice).to.equal(classic_league_data.startPrice)
	})

	it("League is NOT PRESENT", async () => {
		await User.create(test_user_2)
		const non_existing_league_id = mongoose.Types.ObjectId("51bb793aca2ab77a3200000d")
		const res = await requester.get(api).set("Authorization", token_2).query({ leagueID: non_existing_league_id.toString() })

		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.LEAGUE_NOT_FOUND.code)
		expect(res.body.status).to.equal(Errors.LEAGUE_NOT_FOUND.status)
	})

})

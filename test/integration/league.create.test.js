import { expect, should, use } from "chai"
import chaiHttp from "chai-http"
import config from "config"
import { after, before, describe, it } from "mocha"
import { League, Team, User } from "../../src/database/index.js"
import { Errors, tokenUtils } from "../../src/utils/index.js"
import { findPropertyValueInNestedObject, requester } from "./index.js"

use(chaiHttp)
should()

const api = "/fantasta/league/create"

const test_user_1 = {
	//_id: will be added once the user is created
	email: "test_1@test.com",
	password: "password_1",
	username: "username_1"
}
const token_1 = tokenUtils.Create(config.token.kid, test_user_1.email, test_user_1.password, test_user_1.username)

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
	teamname: "team_name_1"
}
const mantra_league_data = {
	name: "league_2",
	password: "league_2_password",
	participants: 2,
	type: "mantra",
	goalkeepers: 1,
	defenders: 4,     // it will be set to 0 by the validation
	midfielders: 4,   // it will be set to 0 by the validation
	strikers: 2,      // it will be set to 0 by the validation
	players: 10,
	budget: 11,
	countdown: 3,
	auctionType: "call",
	startPrice: "zero",
	teamname: "team_name_2"
}

describe("LEAGUE.CREATE", () => {

	before(async () => {

		// Clean DB
		await User.deleteMany()
		await League.deleteMany()
		await Team.deleteMany()

		// Create User
		const test_user_1_db = await User.create(test_user_1)
		test_user_1["_id"] = test_user_1_db._id.toString()
	})

	after(() => {
		requester.close()
	})

	it("Body is undefined", async () => {
		const res = await requester.post(api)

		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.LEAGUE_ERROR.code)     // todo: why not PARAMS_ERROR?
		expect(res.body.status).to.equal(Errors.LEAGUE_ERROR.status) // todo: why not PARAMS_ERROR?
	})

	it("Body is empty", async () => {
		const res = await requester.post(api).send({})

		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.LEAGUE_ERROR.code)     // todo: why not PARAMS_ERROR?
		expect(res.body.status).to.equal(Errors.LEAGUE_ERROR.status) // todo: why not PARAMS_ERROR?
	})

	it("user CREATE a LEAGUE", async () => {
		const res = await requester.post(api).set("Authorization", token_1).send(classic_league_data)

		expect(res).to.have.status(200)
		expect(res.body).to.be.a("object")

		// Check user object
		expect(res.body.user).to.be.a("object")
		expect(res.body.user._id).to.equal(test_user_1._id)
		expect(res.body.user.username).to.equal(test_user_1.username)
		expect(res.body.user.leagues).to.have.length(1)
		expect(findPropertyValueInNestedObject(res.body.user.leagues, "_id", res.body.league._id)).to.be.true
		expect(findPropertyValueInNestedObject(res.body.user.leagues, "name", classic_league_data.name)).to.be.true
		expect(findPropertyValueInNestedObject(res.body.user.leagues, "_id", res.body.team._id)).to.be.true
		expect(findPropertyValueInNestedObject(res.body.user.leagues, "name", classic_league_data.teamname)).to.be.true

		// Check team object
		expect(res.body.team).to.be.a("object")
		expect(res.body.team.name).to.equal(classic_league_data.teamname)
		expect(res.body.team.budget).to.equal(classic_league_data.budget)
		expect(res.body.team.footballPlayers).to.have.length(0)
		expect(res.body.team.user._id).to.equal(test_user_1._id)
		expect(res.body.team.user.name).to.equal(test_user_1.username)

		// Check league object
		expect(res.body.league).to.be.a("object")
		expect(res.body.league.name).to.equal(classic_league_data.name)
		expect(res.body.league.password).to.equal(classic_league_data.password)
		expect(res.body.league.participants).to.equal(classic_league_data.participants)
		expect(res.body.league.type).to.equal(classic_league_data.type)
		expect(res.body.league.goalkeepers).to.equal(classic_league_data.goalkeepers)
		expect(res.body.league.defenders).to.equal(classic_league_data.defenders)
		expect(res.body.league.midfielders).to.equal(classic_league_data.midfielders)
		expect(res.body.league.strikers).to.equal(classic_league_data.strikers)
		expect(res.body.league.players).to.equal(0)
		expect(res.body.league.budget).to.equal(classic_league_data.budget)
		expect(res.body.league.countdown).to.equal(classic_league_data.countdown)
		expect(res.body.league.auctionType).to.equal(classic_league_data.auctionType)
		expect(res.body.league.startPrice).to.equal(classic_league_data.startPrice)

		expect(res.body.league.admin).to.be.a("object")
		expect(res.body.league.admin._id).to.equal(test_user_1._id)
		expect(res.body.league.admin.name).to.equal(test_user_1.username)

		expect(res.body.league.teams).to.have.length(1)
		expect(findPropertyValueInNestedObject(res.body.league.teams, "_id", res.body.team._id)).to.be.true
		expect(findPropertyValueInNestedObject(res.body.league.teams, "name", classic_league_data.teamname)).to.be.true
		expect(findPropertyValueInNestedObject(res.body.league.teams, "_id", test_user_1._id)).to.be.true
		expect(findPropertyValueInNestedObject(res.body.league.teams, "name", test_user_1.name)).to.be.true
	})

	it("user CREATE a LEAGUE with an EXISTING NAME", async () => {
		const res = await requester.post(api).set("Authorization", token_1).send(classic_league_data)

		expect(res).to.have.status(400)
		expect(res.body).to.be.a("object")
		expect(res.body.code).to.equal(Errors.LEAGUE_ALREADY_EXISTS.code)
		expect(res.body.status).to.equal(Errors.LEAGUE_ALREADY_EXISTS.status)
	})

	it("user CREATE an other LEAGUE", async () => {
		const res = await requester.post(api).set("Authorization", token_1).send(mantra_league_data)

		expect(res).to.have.status(200)
		expect(res.body).to.be.a("object")

		// Check user object
		expect(res.body.user).to.be.a("object")
		expect(res.body.user._id).to.equal(test_user_1._id)
		expect(res.body.user.username).to.equal(test_user_1.username)
		expect(res.body.user.leagues).to.have.length(2)
		expect(findPropertyValueInNestedObject(res.body.user.leagues, "_id", res.body.league._id)).to.be.true
		expect(findPropertyValueInNestedObject(res.body.user.leagues, "name", classic_league_data.name)).to.be.true
		expect(findPropertyValueInNestedObject(res.body.user.leagues, "name", classic_league_data.teamname)).to.be.true
		expect(findPropertyValueInNestedObject(res.body.user.leagues, "_id", res.body.league._id)).to.be.true
		expect(findPropertyValueInNestedObject(res.body.user.leagues, "name", mantra_league_data.name)).to.be.true
		expect(findPropertyValueInNestedObject(res.body.user.leagues, "_id", res.body.team._id)).to.be.true
		expect(findPropertyValueInNestedObject(res.body.user.leagues, "name", mantra_league_data.teamname)).to.be.true

		// Check team object
		expect(res.body.team).to.be.a("object")
		expect(res.body.team.name).to.equal(mantra_league_data.teamname)
		expect(res.body.team.budget).to.equal(res.body.league.budget)
		expect(res.body.team.footballPlayers).to.have.length(0)
		expect(res.body.team.user._id).to.equal(res.body.user._id)
		expect(res.body.team.user.name).to.equal(test_user_1.username)

		// Check league object
		expect(res.body.league).to.be.a("object")
		expect(res.body.league.name).to.equal(mantra_league_data.name)
		expect(res.body.league.password).to.equal(mantra_league_data.password)
		expect(res.body.league.participants).to.equal(mantra_league_data.participants)
		expect(res.body.league.type).to.equal(mantra_league_data.type)
		expect(res.body.league.goalkeepers).to.equal(mantra_league_data.goalkeepers)
		expect(res.body.league.defenders).to.equal(0)
		expect(res.body.league.midfielders).to.equal(0)
		expect(res.body.league.strikers).to.equal(0)
		expect(res.body.league.players).to.equal(mantra_league_data.players)
		expect(res.body.league.budget).to.equal(mantra_league_data.budget)
		expect(res.body.league.countdown).to.equal(mantra_league_data.countdown)
		expect(res.body.league.auctionType).to.equal(mantra_league_data.auctionType)
		expect(res.body.league.startPrice).to.equal(mantra_league_data.startPrice)

		expect(res.body.league.admin).to.be.a("object")
		expect(res.body.league.admin._id).to.equal(res.body.user._id)
		expect(res.body.league.admin.name).to.equal(res.body.user.username)

		expect(res.body.league.teams).to.have.length(1)
		expect(findPropertyValueInNestedObject(res.body.league.teams, "_id", res.body.team._id)).to.be.true
		expect(findPropertyValueInNestedObject(res.body.league.teams, "name", mantra_league_data.teamname)).to.be.true
		expect(findPropertyValueInNestedObject(res.body.league.teams, "_id", test_user_1._id)).to.be.true
		expect(findPropertyValueInNestedObject(res.body.league.teams, "name", test_user_1.name)).to.be.true
	})

})

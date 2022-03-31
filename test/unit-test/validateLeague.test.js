import { expect } from "chai"
import _ from "lodash"
import { describe, it } from "mocha"

import { Errors , leagueUtils } from "../../src/utils"

describe("LEAGUE VALIDATION", () => {

	let leagueSettingsClassic = {
		name: "league_1",
		password: "password_1",
		participants: 2,
		type: "classic",
		goalkeepers: 1,
		defenders: 4,
		midfielders: 4,
		strikers: 2,
		players: 999,      // it will be set to 0 by the validateleague()
		budget: 500,
		countdown: 3,
		auctionType: "random",
		startPrice: "zero",
		teamname: "squadradelcazzo",
		status: "new",
		isDeleted: false
	}

	let leagueSettingsMantra = {
		name: "league_2",
		password: "password_2",
		participants: 2,
		type: "mantra",
		goalkeepers: 1,
		defenders: 999,     // it will be set to 0 by the validateleague()
		midfielders: 999,   // it will be set to 0 by the validateleague()
		strikers: 999,      // it will be set to 0 by the validateleague()
		players: 10,
		budget: 500,
		countdown: 3,
		auctionType: "random",
		startPrice: "zero",
		teamname: "squadradelcazzo",
		status: "new",
		isDeleted: false
	}

	it("VALIDATE leagueSettings CLASSIC", async () => {
		const validated_leagueSettings = leagueUtils.validateleague(leagueSettingsClassic)
		let expected_leagueSettings = _.clone(leagueSettingsClassic)
		delete expected_leagueSettings["teamname"]
		expected_leagueSettings["players"] = 0

		expect(validated_leagueSettings.valid).to.equal(true)
		expect(validated_leagueSettings.league).to.be.a("object")
		expect(validated_leagueSettings.league).to.deep.equal(expected_leagueSettings)
	})

	it("VALIDATE leagueSettings MANTRA", async () => {
		const validated_leagueSettings = leagueUtils.validateleague(leagueSettingsMantra)
		let expected_leagueSettings = _.clone(leagueSettingsMantra)
		delete expected_leagueSettings["teamname"]
		expected_leagueSettings["defenders"] = 0
		expected_leagueSettings["midfielders"] = 0
		expected_leagueSettings["strikers"] = 0

		expect(validated_leagueSettings.valid).to.equal(true)
		expect(validated_leagueSettings.league).to.be.a("object")
		expect(validated_leagueSettings.league).to.deep.equal(expected_leagueSettings)
	})

	it("VALIDATE leagueSettings with WRONG LEAGUE NAME", async () => {
		let leagueSettings_wrong = _.clone(leagueSettingsClassic)
		leagueSettings_wrong.name = ""

		let leagueData = leagueUtils.validateleague(leagueSettings_wrong)

		expect(leagueData.valid).to.equal(false)
		expect(leagueData.error).to.be.a("object")
		expect(leagueData.error.code).to.equal( Errors.LEAGUE_NAME_ERROR.code )
	})

	it("VALIDATE leagueSettings with WRONG LEAGUE PASSWORD", async () => {
		let leagueSettings_wrong = _.clone(leagueSettingsClassic)
		leagueSettings_wrong.password = ""
        
		let leagueData = leagueUtils.validateleague(leagueSettings_wrong)

		expect(leagueData.valid).to.equal(false)
		expect(leagueData.error).to.be.a("object")
		expect(leagueData.error.code).to.equal( Errors.LEAGUE_PASSWORD_ERROR.code )
	})

	it("VALIDATE leagueSettings with WRONG TEAM NAME", async () => {
		let leagueSettings_wrong = _.clone(leagueSettingsClassic)
		leagueSettings_wrong.teamname = ""
        
		let leagueData = leagueUtils.validateleague(leagueSettings_wrong)

		expect(leagueData.valid).to.equal(false)
		expect(leagueData.error).to.be.a("object")
		expect(leagueData.error.code).to.equal( Errors.TEAM_ERROR.code )
	})

	it("VALIDATE leagueSettings with WRONG AUCTION TYPE", async () => {
		let leagueSettings_wrong = _.clone(leagueSettingsClassic)
		leagueSettings_wrong.auctionType = "alphabetic,call,random"
        
		let leagueData = leagueUtils.validateleague(leagueSettings_wrong)

		expect(leagueData.valid).to.equal(false)
		expect(leagueData.error).to.be.a("object")
		expect(leagueData.error.code).to.equal( Errors.AUCTION_TYPE_ERROR.code )
	})

	it("VALIDATE leagueSettings with WRONG START PRICE", async () => {
		let leagueSettings_wrong = _.clone(leagueSettingsClassic)
		leagueSettings_wrong.startPrice = "zero,listPrice"
        
		let leagueData = leagueUtils.validateleague(leagueSettings_wrong)

		expect(leagueData.valid).to.equal(false)
		expect(leagueData.error).to.be.a("object")
		expect(leagueData.error.code).to.equal( Errors.START_PRICE_ERROR.code )
	})

	it("VALIDATE leagueSettings with WRONG PARTICIPANT", async () => {
		let leagueSettings_wrong = _.clone(leagueSettingsClassic)
		leagueSettings_wrong.participants = 1
        
		let leagueData = leagueUtils.validateleague(leagueSettings_wrong)

		expect(leagueData.valid).to.equal(false)
		expect(leagueData.error).to.be.a("object")
		expect(leagueData.error.code).to.equal( Errors.ATTENDEES_ERROR.code )
	})

	it("VALIDATE leagueSettings with WRONG TYPE", async () => {
		let leagueSettings_wrong = _.clone(leagueSettingsClassic)
		leagueSettings_wrong.type = "mantra,classic"
        
		let leagueData = leagueUtils.validateleague(leagueSettings_wrong)

		expect(leagueData.valid).to.equal(false)
		expect(leagueData.error).to.be.a("object")
		expect(leagueData.error.code).to.equal( Errors.LEAGUE_TYPE_ERROR.code )
	})

	it("VALIDATE leagueSettings with WRONG DEFENDERS", async () => {
		let leagueSettings_wrong = _.clone(leagueSettingsClassic)
		leagueSettings_wrong.defenders = 0
        
		let leagueData = leagueUtils.validateleague(leagueSettings_wrong)

		expect(leagueData.valid).to.equal(false)
		expect(leagueData.error).to.be.a("object")
		expect(leagueData.error.code).to.equal( Errors.DEFENDERS_NUMBER_ERROR.code )
	})

	it("VALIDATE leagueSettings with WRONG MIDFIELDERS", async () => {
		let leagueSettings_wrong = _.clone(leagueSettingsClassic)
		leagueSettings_wrong.midfielders = 0
        
		let leagueData = leagueUtils.validateleague(leagueSettings_wrong)
        
		expect(leagueData.valid).to.equal(false)
		expect(leagueData.error).to.be.a("object")
		expect(leagueData.error.code).to.equal( Errors.MIDFIELDERS_NUMBER_ERROR.code )
	})

	it("VALIDATE leagueSettings with WRONG STRIKERS", async () => {
		let leagueSettings_wrong = _.clone(leagueSettingsClassic)
		leagueSettings_wrong.strikers = 0
        
		let leagueData = leagueUtils.validateleague(leagueSettings_wrong)

		expect(leagueData.valid).to.equal(false)
		expect(leagueData.error).to.be.a("object")
		expect(leagueData.error.code).to.equal( Errors.STRIKERS_NUMBER_ERROR.code )
	})

	it("VALIDATE leagueSettings with WRONG TOTAL PLAYERS (CLASSIC)", async () => {
		let leagueSettings_wrong = _.clone(leagueSettingsClassic)
		leagueSettings_wrong.defenders = 3
		leagueSettings_wrong.midfielders = 3
		leagueSettings_wrong.strikers = 1
        
		let leagueData = leagueUtils.validateleague(leagueSettings_wrong)

		expect(leagueData.valid).to.equal(false)
		expect(leagueData.error).to.be.a("object")
		expect(leagueData.error.code).to.equal( Errors.PLAYERS_NUMBER_ERROR.code )
	})

	it("VALIDATE leagueSettings with WRONG PLAYERS (MANTRA)", async () => {
		let leagueSettings_wrong = _.clone(leagueSettingsMantra)
		leagueSettings_wrong.players = 0
        
		let leagueData = leagueUtils.validateleague(leagueSettings_wrong)

		expect(leagueData.valid).to.equal(false)
		expect(leagueData.error).to.be.a("object")
		expect(leagueData.error.code).to.equal( Errors.PLAYERS_NUMBER_ERROR.code )
	})

	it("VALIDATE leagueSettings with WRONG BUDGET", async () => {
		let leagueSettings_wrong = _.clone(leagueSettingsClassic)
		leagueSettings_wrong.budget = 5
        
		let leagueData = leagueUtils.validateleague(leagueSettings_wrong)

		expect(leagueData.valid).to.equal(false)
		expect(leagueData.error).to.be.a("object")
		expect(leagueData.error.code).to.equal( Errors.BUDGET_ERROR.code )
	})

	it("VALIDATE leagueSettings with WRONG COUNTDOWN", async () => {
		let leagueSettings_wrong = _.clone(leagueSettingsClassic)
		leagueSettings_wrong.countdown = 1
        
		let leagueData = leagueUtils.validateleague(leagueSettings_wrong)

		expect(leagueData.valid).to.equal(false)
		expect(leagueData.error).to.be.a("object")
		expect(leagueData.error.code).to.equal( Errors.COUNTDOWN_ERROR.code )
	})
})

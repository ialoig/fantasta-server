import { Constants, leagueUtils } from "../../src/utils"
import { expect } from 'chai'
import _ from 'lodash'
import { strict as assert } from 'assert'
// import { printObject } from '../integration/index.js'

const printObject = (msg, obj) => {
    console.log("---------------------------------------")
    console.log(`${msg}: ${JSON.stringify(obj, null, 2)}`)
    console.log("---------------------------------------")
}

describe("LEAGUE VALIDATION", () => {

    const userID = "1234567890"

    let leagueSettings = {
        //admin: will be added by the validateLeague
        name: "legadelcazzo",
        password: "legadelcazzo",
        participants: 2,
        type: "classic",
        goalkeepers: 1,
        defenders: 4,
        midfielders: 4,
        strikers: 2,
        players: 10,
        budget: 500,
        countdown: 3,
        auctionType: "random",
        startPrice: "zero",
        teamname: "squadradelcazzo"
    }

    const expectException = (wrong_league_settings) => {
        try {
            leagueUtils.validateleague(wrong_league_settings, userID)
        }
        catch (error) {
            assert.strictEqual(error, Constants.PARAMS_ERROR)
        }
    }


    it(`VALIDATE leagueSettings`, async () => {

        const validated_leagueSettings = leagueUtils.validateleague(leagueSettings, userID)
        let expected_leagueSettings = _.clone(leagueSettings)
        expected_leagueSettings["admin"] = userID
        delete expected_leagueSettings["teamname"]
        assert.strictEqual(_.isEqual(validated_leagueSettings, expected_leagueSettings), true)
    })

    it(`VALIDATE leagueSettings with WRONG LEAGUE NAME`, async () => {
        let leagueSettings_wrong_league_name = _.clone(leagueSettings)
        leagueSettings_wrong_league_name.name = ""
        expectException(leagueSettings_wrong_league_name)
    })

    it(`VALIDATE leagueSettings with WRONG LEAGUE PASSWORD`, async () => {
        let leagueSettings_wrong_league_password = _.clone(leagueSettings)
        leagueSettings_wrong_league_password.password = ""
        expectException(leagueSettings_wrong_league_password)
    })

    it(`VALIDATE leagueSettings with WRONG TEAM NAME`, async () => {
        let leagueSettings_wrong_team_name = _.clone(leagueSettings)
        leagueSettings_wrong_team_name.teamname = ""
        expectException(leagueSettings_wrong_team_name)
    })

    it(`VALIDATE leagueSettings with WRONG AUCTION TYPE`, async () => {
        let leagueSettings_wrong_auction_type = _.clone(leagueSettings)
        leagueSettings_wrong_auction_type.auctionType = "alphabetic,call,random"
        expectException(leagueSettings_wrong_auction_type)
    })

    it(`VALIDATE leagueSettings with WRONG START PRICE`, async () => {
        let leagueSettings_wrong_start_price = _.clone(leagueSettings)
        leagueSettings_wrong_start_price.startPrice = "zero,listPrice"
        expectException(leagueSettings_wrong_start_price)
    })


    it(`VALIDATE leagueSettings with WRONG PARTICIPANT`, async () => {
        let leagueSettings_wrong_participants = _.clone(leagueSettings)
        leagueSettings_wrong_participants.participants = 1
        expectException(leagueSettings_wrong_participants)
    })

    it(`VALIDATE leagueSettings with WRONG TYPE`, async () => {
        let leagueSettings_wrong_type = _.clone(leagueSettings)
        leagueSettings_wrong_type.type = "mantra,classic"
        expectException(leagueSettings_wrong_type)
    })

    it(`VALIDATE leagueSettings with WRONG DEFENDERS`, async () => {
        let leagueSettings_wrong_defenders = _.clone(leagueSettings)
        leagueSettings_wrong_defenders.defenders = 0
        expectException(leagueSettings_wrong_defenders)
    })

    it(`VALIDATE leagueSettings with WRONG MIDFIELDERS`, async () => {
        let leagueSettings_wrong_start_midfielders = _.clone(leagueSettings)
        leagueSettings_wrong_start_midfielders.midfielders = 0
        expectException(leagueSettings_wrong_start_midfielders)
    })

    it(`VALIDATE leagueSettings with WRONG STRIKERS`, async () => {
        let leagueSettings_wrong_strikers = _.clone(leagueSettings)
        leagueSettings_wrong_strikers.strikers = 1
        expectException(leagueSettings_wrong_strikers)
    })

    it(`VALIDATE leagueSettings with WRONG PLAYERS`, async () => {
        let leagueSettings_wrong_players = _.clone(leagueSettings)
        leagueSettings_wrong_players.players = 0
        expectException(leagueSettings_wrong_players)
    })

    it(`VALIDATE leagueSettings with WRONG BUDGET`, async () => {
        let leagueSettings_wrong_budget = _.clone(leagueSettings)
        leagueSettings_wrong_budget.budget = 5
        expectException(leagueSettings_wrong_budget)
    })

    it(`VALIDATE leagueSettings with WRONG COUNTDOWN`, async () => {
        let leagueSettings_wrong_countdown = _.clone(leagueSettings)
        leagueSettings_wrong_countdown.countdown = 1
        expectException(leagueSettings_wrong_countdown)
    })

})

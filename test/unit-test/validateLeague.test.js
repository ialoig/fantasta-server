import { leagueUtils } from "../../src/utils"
import { expect, } from 'chai'
import { strict as assert } from 'assert'
import _ from 'lodash'

const printObject = (msg, obj) => {
    console.log("---------------------------------------")
    console.log(`${msg}: ${JSON.stringify(obj, null, 2)}`)
    console.log("---------------------------------------")
}

describe("LEAGUE VALIDATION", () => {

    const userID = "0123456789"

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
        status: 'new',
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
        status: 'new',
        isDeleted: false
    }

    it(`VALIDATE leagueSettings CLASSIC`, async () => {
        const validated_leagueSettings = leagueUtils.validateleague(leagueSettingsClassic, userID)
        let expected_leagueSettings = _.clone(leagueSettingsClassic)
        delete expected_leagueSettings["teamname"]
        expected_leagueSettings["admin"] = userID
        expected_leagueSettings["players"] = 0
        expect(validated_leagueSettings).to.deep.equal(expected_leagueSettings)
    })

    it(`VALIDATE leagueSettings MANTRA`, async () => {
        const validated_leagueSettings = leagueUtils.validateleague(leagueSettingsMantra, userID)
        let expected_leagueSettings = _.clone(leagueSettingsMantra)
        delete expected_leagueSettings["teamname"]
        expected_leagueSettings["admin"] = userID
        expected_leagueSettings["defenders"] = 0
        expected_leagueSettings["midfielders"] = 0
        expected_leagueSettings["strikers"] = 0
        expect(validated_leagueSettings).to.deep.equal(expected_leagueSettings)
    })

    it(`VALIDATE leagueSettings with WRONG LEAGUE NAME`, async () => {
        let leagueSettings_wrong_league_name = _.clone(leagueSettingsClassic)
        leagueSettings_wrong_league_name.name = ""
        expect(() => leagueUtils.validateleague(leagueSettings_wrong_league_name, userID)).to.throw();
    })

    it(`VALIDATE leagueSettings with WRONG LEAGUE PASSWORD`, async () => {
        let leagueSettings_wrong_league_password = _.clone(leagueSettingsClassic)
        leagueSettings_wrong_league_password.password = ""
        expect(() => leagueUtils.validateleague(leagueSettings_wrong_league_password, userID)).to.throw();
    })

    it(`VALIDATE leagueSettings with WRONG TEAM NAME`, async () => {
        let leagueSettings_wrong_team_name = _.clone(leagueSettingsClassic)
        leagueSettings_wrong_team_name.teamname = ""
        expect(() => leagueUtils.validateleague(leagueSettings_wrong_team_name, userID)).to.throw();
    })

    it(`VALIDATE leagueSettings with WRONG AUCTION TYPE`, async () => {
        let leagueSettings_wrong_auction_type = _.clone(leagueSettingsClassic)
        leagueSettings_wrong_auction_type.auctionType = "alphabetic,call,random"
        expect(() => leagueUtils.validateleague(leagueSettings_wrong_auction_type, userID)).to.throw();
    })

    it(`VALIDATE leagueSettings with WRONG START PRICE`, async () => {
        let leagueSettings_wrong_start_price = _.clone(leagueSettingsClassic)
        leagueSettings_wrong_start_price.startPrice = "zero,listPrice"
        expect(() => leagueUtils.validateleague(leagueSettings_wrong_start_price, userID)).to.throw();
    })

    it(`VALIDATE leagueSettings with WRONG PARTICIPANT`, async () => {
        let leagueSettings_wrong_participants = _.clone(leagueSettingsClassic)
        leagueSettings_wrong_participants.participants = 1
        expect(() => leagueUtils.validateleague(leagueSettings_wrong_participants, userID)).to.throw();
    })

    it(`VALIDATE leagueSettings with WRONG TYPE`, async () => {
        let leagueSettings_wrong_type = _.clone(leagueSettingsClassic)
        leagueSettings_wrong_type.type = "mantra,classic"
        expect(() => leagueUtils.validateleague(leagueSettings_wrong_type, userID)).to.throw();
    })

    it(`VALIDATE leagueSettings with WRONG DEFENDERS`, async () => {
        let leagueSettings_wrong_defenders = _.clone(leagueSettingsClassic)
        leagueSettings_wrong_defenders.defenders = 0
        expect(() => leagueUtils.validateleague(leagueSettings_wrong_defenders, userID)).to.throw();
    })

    it(`VALIDATE leagueSettings with WRONG MIDFIELDERS`, async () => {
        let leagueSettings_wrong_start_midfielders = _.clone(leagueSettingsClassic)
        leagueSettings_wrong_start_midfielders.midfielders = 0
        expect(() => leagueUtils.validateleague(leagueSettings_wrong_start_midfielders, userID)).to.throw();
    })

    it(`VALIDATE leagueSettings with WRONG STRIKERS`, async () => {
        let leagueSettings_wrong_strikers = _.clone(leagueSettingsClassic)
        leagueSettings_wrong_strikers.strikers = 0
        expect(() => leagueUtils.validateleague(leagueSettings_wrong_strikers, userID)).to.throw();
    })

    it(`VALIDATE leagueSettings with WRONG TOTAL PLAYERS (CLASSIC)`, async () => {
        let leagueSettings_wrong_total_players = _.clone(leagueSettingsClassic)
        leagueSettings_wrong_total_players.defenders = 3
        leagueSettings_wrong_total_players.midfielders = 3
        leagueSettings_wrong_total_players.strikers = 1
        expect(() => leagueUtils.validateleague(leagueSettings_wrong_total_players, userID)).to.throw();
    })

    it(`VALIDATE leagueSettings with WRONG PLAYERS (MANTRA)`, async () => {
        let leagueSettings_wrong_players = _.clone(leagueSettingsMantra)
        leagueSettings_wrong_players.players = 0
        expect(() => leagueUtils.validateleague(leagueSettings_wrong_players, userID)).to.throw();
    })

    it(`VALIDATE leagueSettings with WRONG BUDGET`, async () => {
        let leagueSettings_wrong_budget = _.clone(leagueSettingsClassic)
        leagueSettings_wrong_budget.budget = 5
        expect(() => leagueUtils.validateleague(leagueSettings_wrong_budget, userID)).to.throw();
    })

    it(`VALIDATE leagueSettings with WRONG COUNTDOWN`, async () => {
        let leagueSettings_wrong_countdown = _.clone(leagueSettingsClassic)
        leagueSettings_wrong_countdown.countdown = 1
        expect(() => leagueUtils.validateleague(leagueSettings_wrong_countdown, userID)).to.throw();
    })
})

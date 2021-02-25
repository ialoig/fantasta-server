import { League, FootballPlayer, Team, User } from "../../src/database";
import { default as apis } from '../../src/routes/apis'

const assert = require("assert")

describe("API - League.join", function () {
    this.timeout(0) // disable test environment timeout

    it(`should be able to let User to join a League`, done => {

        const footballPlayerListExpected_obj = {
            "250": {
                id: 250,
                name: "HANDANOVIC",
                team: "Inter",
                roleClassic: "P",
                roleMantra: ["Por"],
                actualPrice: 18,
                initialPrice: 18
            }
        }

        // apis.league.join()
        apis.league.create()

        // assert.strictEqual(_.isEqual(footballPlayerList_obj, footballPlayerListExpected_obj), true)

        done()
    })

})
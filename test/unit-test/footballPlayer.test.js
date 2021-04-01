import { containsCorrectData } from "../../src/footballPlayers/saveFootballPlayers.js"
import { strict as assert } from 'assert'

describe("FOOTBALLPLAYER VALIDATION", function () {

    it(`validate footballPlayerList`, done => {

        const footballPlayerList_obj = {
            "1": {
                id: 1,
                name: "PIPPOTTO",
                team: "Milan",
                roleClassic: "A",
                roleMantra: ["Pc"],
                actualPrice: 25,
                initialPrice: 26
            },
            "2": {
                id: 2,
                name: "INKUBO",
                team: "Roma",
                roleClassic: "D",
                roleMantra: ["Dd", "Dc"],
                actualPrice: 25,
                initialPrice: 26
            },
            "3": {
                id: 3,
                name: "BELOX",
                team: "Inter",
                roleClassic: "C",
                roleMantra: ["T", "A"],
                actualPrice: 25,
                initialPrice: 26
            }
        }

        for (const [footballPlayerId, footballPlayer_obj] of Object.entries(footballPlayerList_obj)) {
            assert.strictEqual(containsCorrectData(footballPlayer_obj), true)
        }
        done()
    })

    it(`validate footballPlayerList with WRONG ID`, done => {

        const footballPlayerList_obj_wrong_id = {
            "4": {
                id: -1,
                name: "name1",
                team: "team1",
                roleClassic: "P",
                roleMantra: ["Por"],
                actualPrice: 25,
                initialPrice: 26
            }
        }

        for (const [footballPlayerId, footballPlayer_obj] of Object.entries(footballPlayerList_obj_wrong_id)) {
            assert.strictEqual(containsCorrectData(footballPlayer_obj), false)
        }
        done()
    })

    it(`validate footballPlayerList with WRONG NAME`, done => {

        const footballPlayerList_obj_wrong_name = {
            "4": {
                id: 4,
                name: "",
                team: "team1",
                roleClassic: "P",
                roleMantra: ["Por"],
                actualPrice: 25,
                initialPrice: 26
            }
        }

        for (const [footballPlayerId, footballPlayer_obj] of Object.entries(footballPlayerList_obj_wrong_name)) {
            assert.strictEqual(containsCorrectData(footballPlayer_obj), false)
        }
        done()
    })

    it(`validate footballPlayerList with WRONG TEAM`, done => {

        const footballPlayerList_obj_wrong_team = {
            "4": {
                id: 4,
                name: "name1",
                team: "",
                roleClassic: "P",
                roleMantra: ["Por"],
                actualPrice: 25,
                initialPrice: 26
            }
        }

        for (const [footballPlayerId, footballPlayer_obj] of Object.entries(footballPlayerList_obj_wrong_team)) {
            assert.strictEqual(containsCorrectData(footballPlayer_obj), false)
        }
        done()
    })

    it(`validate footballPlayerList with WRONG CLASSIC ROLE`, done => {

        const footballPlayerList_obj_wrong_roleClassic = {
            "4": {
                id: 4,
                name: "name1",
                team: "team1",
                roleClassic: "Portiere",
                roleMantra: ["Por"],
                actualPrice: 25,
                initialPrice: 26
            }
        }

        for (const [footballPlayerId, footballPlayer_obj] of Object.entries(footballPlayerList_obj_wrong_roleClassic)) {
            assert.strictEqual(containsCorrectData(footballPlayer_obj), false)
        }
        done()
    })

    it(`validate footballPlayerList with WRONG MANTRA ROLE`, done => {

        const footballPlayerList_obj_wrong_roleMantra = {
            "4": {
                id: 4,
                name: "name1",
                team: "team1",
                roleClassic: "P",
                roleMantra: ["Portiere"],
                actualPrice: 25,
                initialPrice: 26
            }
        }

        for (const [footballPlayerId, footballPlayer_obj] of Object.entries(footballPlayerList_obj_wrong_roleMantra)) {
            assert.strictEqual(containsCorrectData(footballPlayer_obj), false)
        }
        done()
    })

    it(`validate footballPlayerList with WRONG ACTUAL PRICE`, done => {

        const footballPlayerList_obj_wrong_actualPrice = {
            "4": {
                id: 4,
                name: "name1",
                team: "team1",
                roleClassic: "P",
                roleMantra: ["Por"],
                actualPrice: -25,
                initialPrice: 26
            }
        }

        for (const [footballPlayerId, footballPlayer_obj] of Object.entries(footballPlayerList_obj_wrong_actualPrice)) {
            assert.strictEqual(containsCorrectData(footballPlayer_obj), false)
        }
        done()
    })

    it(`validate footballPlayerList with WRONG INITIAL PRICE`, done => {

        const footballPlayerList_obj_wrong_initialPrice = {
            "4": {
                id: 4,
                name: "name1",
                team: "team1",
                roleClassic: "P",
                roleMantra: ["Por"],
                actualPrice: 25,
                initialPrice: -26
            }
        }

        for (const [footballPlayerId, footballPlayer_obj] of Object.entries(footballPlayerList_obj_wrong_initialPrice)) {
            assert.strictEqual(containsCorrectData(footballPlayer_obj), false)
        }
        done()
    })
})

import "regenerator-runtime/runtime.js"
import { containsCorrectData } from "../../src/footballPlayers/saveFootballPlayers"

const assert = require("assert")

describe("FootballPlayer validation", function () {
   
    it(`should be able to validate footballPlayers`, done => {

        const footballPlayerList_obj = {
            "1": {
                id: 1,
                name: "PIPPOTTO",
                team: "Milan",
                roleClassic: "P",
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

    it(`should be able to validate footballPlayerList with wrong id`, done => {

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

    it(`should be able to validate footballPlayerList with wrong name`, done => {

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

    it(`should be able to validate footballPlayerList with wrong team`, done => {

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

    it(`should be able to validate footballPlayerList with wrong roleClassic`, done => {

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
    
    it(`should be able to validate footballPlayerList with wrong roleMantra`, done => {

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

    it(`should be able to validate footballPlayerList with wrong actualPrice`, done => {

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

    it(`should be able to validate footballPlayerList with wrong initialPrice`, done => {

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
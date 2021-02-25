import "regenerator-runtime/runtime.js"
import _ from "lodash";
import { xlsxUtils } from "../../src/utils";
import { mergeRoles, getPlayersFromExcelContent } from "../../src/footballPlayers/saveFootballPlayers"

const assert = require("assert")

describe("parse Excel file", function () {
    this.timeout(0) // disable test environment timeout

    it(`should be able to parse Classic and Mantra excel files`, done => {

        const footballPlayerListExpected_obj = {
            "250": {
                id: 250,
                name: "HANDANOVIC",
                team: "Inter",
                roleClassic: "P",
                roleMantra: ["Por"],
                actualPrice: 18,
                initialPrice: 18
            },
            "2214": {
                id: 2214,
                name: "KOLAROV",
                team: "Roma",
                roleClassic: "D",
                roleMantra: ["Ds", "E"],
                actualPrice: 17,
                initialPrice: 15
            },
            "2160": {
                id: 2160,
                name: "GOSENS",
                team: "Atalanta",
                roleClassic: "D",
                roleMantra: ["E"],
                actualPrice: 16,
                initialPrice: 15
            },
            "26": {
                id: 26,
                name: "GOMEZ A",
                team: "Atalanta",
                roleClassic: "C",
                roleMantra: ["T", "A"],
                actualPrice: 25,
                initialPrice: 26
            },
            "2610": {
                id: 2610,
                name: "CRISTIANO RONALDO",
                team: "Juventus",
                roleClassic: "A",
                roleMantra: ["Pc"],
                actualPrice: 43,
                initialPrice: 46
            }
        }
        let excelContentClassic_obj = xlsxUtils.read("test/unit-test/footballPlayerListClassic_test.xls", 1);
        let excelContentMantra_obj = xlsxUtils.read("test/unit-test/footballPlayerListMantra_test.xls", 1);

        // Extract footballPlayer from Json object
        let footballPlayerListClassic_obj = getPlayersFromExcelContent(excelContentClassic_obj, false);
        let footballPlayerListMantra_obj = getPlayersFromExcelContent(excelContentMantra_obj, true);

        let footballPlayerList_obj = mergeRoles(footballPlayerListClassic_obj, footballPlayerListMantra_obj)

        assert.strictEqual(_.isEqual(footballPlayerList_obj, footballPlayerListExpected_obj), true)

        done()
    })

})
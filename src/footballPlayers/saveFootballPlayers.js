import _ from "lodash";
import { FootballPlayer } from "../database";
import { xlsxUtils } from "../utils";
import { secondsFrom, METRIC_STATUS, load_footballPlayer_duration_seconds } from "../metrics"

const printCorruptedPlayer = (footballPlayer_obj, reason) => {
    console.error(`corrupted footballPlayer. Reason: ${reason}. ${JSON.stringify(footballPlayer_obj, null, 2)}`)
}

const containsCorrectData = (footballPlayer_obj) => {

    // all fields must be present
    const mandatoryFields = ["id", "name", "team", "roleClassic", "roleMantra", "actualPrice", "initialPrice"];
    if (!mandatoryFields.every(item => footballPlayer_obj.hasOwnProperty(item))) {
        let reason = "Object does not contain mandatory fields"
        printCorruptedPlayer(footballPlayer_obj, reason)
        return false;
    }

    // Check "id"
    if (footballPlayer_obj["id"] < 0) {
        let reason = "'id' cannot be < 0"
        printCorruptedPlayer(footballPlayer_obj, reason)
        return false;
    }

    // Check "name"
    if (!footballPlayer_obj["name"]) {
        let reason = "'name' cannot be null or empty"
        printCorruptedPlayer(footballPlayer_obj, reason)
        return false;
    }

    // Check "team"
    if (!footballPlayer_obj["team"]) {
        let reason = "'team' cannot be null or empty"
        printCorruptedPlayer(footballPlayer_obj, reason)
        return false;
    }

    // Check "roleClassic"
    let roleClassic = footballPlayer_obj["roleClassic"]
    if (!roleClassic) {
        let reason = "'roleClassic' must be defined"
        printCorruptedPlayer(footballPlayer_obj, reason)
        return false;
    }

    const classicRolesAllowed = ["P", "D", "C", "A"]
    if (!classicRolesAllowed.includes(roleClassic)) {
        let reason = "'roleClassic' value not allowed"
        printCorruptedPlayer(footballPlayer_obj, reason)
        return false;
    }

    // Check "roleMantra"
    let roleMantra = footballPlayer_obj["roleMantra"]
    if (!roleMantra) {
        let reason = "'roleMantra' must be defined"
        printCorruptedPlayer(footballPlayer_obj, reason)
        return false;
    }

    const mantraRolesAllowed = ["Por", "Dd", "Ds", "Dc", "E", "M", "C", "W", "T", "A", "Pc"]
    if (!roleMantra.every(roleMantra => mantraRolesAllowed.includes(roleMantra))) {
        let reason = "'roleMantra' value not allowed"
        printCorruptedPlayer(footballPlayer_obj, reason)
        return false;
    }

    // Check "actualPrice"
    if (footballPlayer_obj["actualPrice"] < 0) {
        let reason = "'actualPrice' cannot be < 0"
        printCorruptedPlayer(footballPlayer_obj, reason)
        return false;
    }

    // Check "initialPrice"
    if (footballPlayer_obj["initialPrice"] < 0) {
        let reason = "'initialPrice' cannot be < 0"
        printCorruptedPlayer(footballPlayer_obj, reason)
        return false;
    }

    return true;
}

const mergeRoles = (footballPlayerListClassic_obj, footballPlayerListMantra_obj) => {
    let footballPlayerList_obj = {}

    for (const [footballPlayerId, footballPlayerClassic_obj] of Object.entries(footballPlayerListClassic_obj)) {

        let footballPlayerMantra_obj = footballPlayerListMantra_obj[footballPlayerId]

        // merge roles
        let footballPlayer_obj = footballPlayerClassic_obj
        footballPlayer_obj["roleMantra"] = footballPlayerMantra_obj["roleMantra"]

        // add to object
        if (containsCorrectData(footballPlayer_obj)) {
            footballPlayerList_obj[footballPlayerId] = footballPlayer_obj;
        }
    }

    return footballPlayerList_obj
}

const getPlayersFromExcelContent = (excelContent_obj, isMantra) => {

    let footballPlayerList_obj = {};

    excelContent_obj.forEach((footballPlayer) => {

        let footballPlayerId = footballPlayer["Id"];

        // Create footballPlayer object
        let footballPlayer_obj = {
            id: footballPlayerId,
            name: footballPlayer["Nome"],
            team: footballPlayer["Squadra"],
            roleClassic: isMantra ? null : footballPlayer["R"],
            roleMantra: isMantra ? footballPlayer["R"].split(';') : null,
            actualPrice: footballPlayer["Qt. A"],
            initialPrice: footballPlayer["Qt. I"],
        };

        footballPlayerList_obj[footballPlayerId] = footballPlayer_obj;
    });

    return footballPlayerList_obj;
}

const saveFootballPlayerWithVersion = async (footballPlayerList_obj, version) => {

    let footballPlayer = FootballPlayer({
        footballPlayers: footballPlayerList_obj,
        version: version,
    });

    try {
        await footballPlayer.save();
    } catch (error) {
        console.error(error);
    }
}

const saveFootballPlayers = async (excelFilenameClassic, excelFilenameMantra) => {

    // used to measure execution time
    let duration_start = process.hrtime()

    // Excel file to Json object
    let excelContentClassic_obj = {}
    let excelContentMantra_obj = {}
    try
    {
        excelContentClassic_obj = xlsxUtils.read(excelFilenameClassic, 1);
    }
    catch (error)
    {
        console.error(`Error reading file: ${excelFilenameClassic}. ${error}`)
        load_footballPlayer_duration_seconds.observe({ status: METRIC_STATUS.ERROR, msg: "readClassicExcelFile"}, secondsFrom(duration_start))
    }

    try
    {
        excelContentMantra_obj = xlsxUtils.read(excelFilenameMantra, 1);
    }
    catch (error)
    {
        console.error(`Error reading file: ${excelFilenameMantra}. ${error}`)
        load_footballPlayer_duration_seconds.observe({ status: METRIC_STATUS.ERROR, msg: "readMantraExcelFile"}, secondsFrom(duration_start))
    }

    if (excelContentClassic_obj.length > 0 && excelContentMantra_obj.length > 0) {

        // Extract footballPlayer from Json object
        let footballPlayerListClassic_obj = getPlayersFromExcelContent(excelContentClassic_obj, false);
        let footballPlayerListMantra_obj = getPlayersFromExcelContent(excelContentMantra_obj, true);

        // Merge Classic and Mantra roles
        let footballPlayerList_obj = mergeRoles(footballPlayerListClassic_obj, footballPlayerListMantra_obj)

        // Update FootballPlayer table
        try
        {
            let footballPlayerListOld_obj = await FootballPlayer.findOne()

            // There is an existing version of FootballPlayer collection in the DB
            if (footballPlayerListOld_obj && footballPlayerListOld_obj.footballPlayers) {

                // Check if an update is needed
                let versionOld = footballPlayerListOld_obj.version
                let equals = _.isEqual(footballPlayerListOld_obj.footballPlayers, footballPlayerList_obj);
                if (!equals) {
                    console.log(`FootballPlayer collection has to be updated`);
                    console.log(`deleting FootballPlayer collection version: ${versionOld}`);
                    FootballPlayer.deleteMany({}, (error, deleteStatus) => {
                        if (error) {
                            console.error(error);
                        }
                        //console.log(`FootballPlayer deleteStatus: ${JSON.stringify(deleteStatus, null, 2)}`);
                        // save new version of FootballPlayer collection
                        saveFootballPlayerWithVersion(footballPlayerList_obj, new Date().getTime())
                    });
                }
                else {
                    console.log(`FootballPlayer collection is up to date. Current version: ${versionOld}`);
                }
            }

            // save footballPlayers collection for the first time
            else {
                console.log(`creation of FootballPlayer collection`);
                saveFootballPlayerWithVersion(footballPlayerList_obj, new Date().getTime())
            }

            console.info(`saveFootballPlayers() execution time: ${secondsFrom(duration_start)} seconds`)
            load_footballPlayer_duration_seconds.observe({ status: METRIC_STATUS.SUCCESS, msg: ""}, secondsFrom(duration_start))
        }
        catch (error)
        {
            console.error(error)
            load_footballPlayer_duration_seconds.observe({ status: METRIC_STATUS.ERROR, msg: error}, secondsFrom(duration_start))
        }
    }
}

export { saveFootballPlayers, containsCorrectData, mergeRoles, getPlayersFromExcelContent };

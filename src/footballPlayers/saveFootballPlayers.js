
import _ from "lodash"

import { FootballPlayer } from "../database"
import { xlsxUtils } from "../utils"
import { errorPlayersMetric, loadPlayersMetric, secondsFrom } from "../metrics"

const classicRolesAllowed = ["P", "D", "C", "A"]
const mandatoryFields = ["id", "name", "team", "roleClassic", "roleMantra", "actualPrice", "initialPrice"];
const mantraRolesAllowed = ["Por", "Dd", "Ds", "Dc", "E", "M", "C", "W", "T", "A", "Pc"]

const containsCorrectData = (footballPlayer_obj) =>
{
    let reason = ''
    if ( !mandatoryFields.every(item => footballPlayer_obj.hasOwnProperty(item)) )  // all fields must be present
    {
        reason = "Object does not contain mandatory fields"
    }
    else if ( footballPlayer_obj["id"] < 0 )                // Check "id"
    {
        reason = "'id' cannot be < 0"
    }
    else if ( !footballPlayer_obj["name"] )                 // Check "name"
    {
        reason = "'name' cannot be null or empty"
    }
    else if ( !footballPlayer_obj["team"] )                 // Check "team"
    {
        reason = "'team' cannot be null or empty"
    }
    else if ( !footballPlayer_obj["roleClassic"] )          // Check "roleClassic"
    {
        reason = "'roleClassic' must be defined"
    }
    else if ( !classicRolesAllowed.includes(footballPlayer_obj["roleClassic"]) )    // Check "roleClassic"
    {
        reason = "'roleClassic' value not allowed"
    }
    else if ( !footballPlayer_obj["roleMantra"] )           // Check "roleMantra"
    {
        reason = "'roleMantra' must be defined"
    }
    else if ( !footballPlayer_obj["roleMantra"].every(roleMantra => mantraRolesAllowed.includes(roleMantra)) )        // Check "roleMantra"
    {
        reason = "'roleMantra' value not allowed"
    }
    else if ( footballPlayer_obj["actualPrice"] < 0 )       // Check "actualPrice"
    {
        reason = "'actualPrice' cannot be < 0"
    }
    else if ( footballPlayer_obj["initialPrice"] < 0 )      // Check "initialPrice"
    {
        reason = "'initialPrice' cannot be < 0"
    }
    else
    {
        return true
    }

    // console.error(`[saveFootballPlayers] corrupted footballPlayer. Reason: ${reason}. ${JSON.stringify(footballPlayer_obj, null, 2)}`)
    return false
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
        console.error(`[saveFootballPlayers] error saving FootballPlayer. ${error}`);
    }
}

const saveFootballPlayers = async ( classicFile, mantraFile ) => {

    // used to measure execution time
    const duration_start = process.hrtime()

    // Excel file to Json object
    let excelContentClassic = xlsxUtils.readFile( classicFile, 1 )
    let excelContentMantra = xlsxUtils.readFile( mantraFile, 1 )
    
    if ( excelContentClassic.length && excelContentMantra.length )
    {
        // Extract footballPlayer from Json object
        let footballPlayerListClassic_obj = getPlayersFromExcelContent(excelContentClassic, false);
        let footballPlayerListMantra_obj = getPlayersFromExcelContent(excelContentMantra, true);

        // Merge Classic and Mantra roles
        let footballPlayerList_obj = mergeRoles(footballPlayerListClassic_obj, footballPlayerListMantra_obj)

        // Update FootballPlayer table
        try
        {
            let footballPlayerListOld_obj = await FootballPlayer.findOne()

            // There is an existing version of FootballPlayer collection in the DB
            if (footballPlayerListOld_obj && footballPlayerListOld_obj.footballPlayers) {

                // Check if an update is needed
                let equals = _.isEqual(footballPlayerListOld_obj.footballPlayers, footballPlayerList_obj);
                
                if ( !equals )
                {
                    console.log(`[saveFootballPlayers] FootballPlayer collection has to be updated`);
                    FootballPlayer.deleteMany({}, (error, deleteStatus) => {
                        if (error) {
                            console.error(`[saveFootballPlayers] error deleting FootballPlayer. ${error}`);
                        }
                        // save new version of FootballPlayer collection
                        saveFootballPlayerWithVersion(footballPlayerList_obj, new Date().getTime())
                    });
                }
            }
            // save footballPlayers collection for the first time
            else {
                console.log(`[saveFootballPlayers] creation of FootballPlayer collection`);
                saveFootballPlayerWithVersion(footballPlayerList_obj, new Date().getTime())
            }

            console.info(`[saveFootballPlayers] execution time: ${secondsFrom(duration_start)} seconds`)
            loadPlayersMetric( duration_start )
        }
        catch (error)
        {
            console.error(`[saveFootballPlayers] error updating FootballPlayer. ${error}`);
            errorPlayersMetric( error, duration_start )
        }
    }
}

export { saveFootballPlayers, containsCorrectData, mergeRoles, getPlayersFromExcelContent };

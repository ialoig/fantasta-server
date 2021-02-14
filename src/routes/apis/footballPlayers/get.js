
import { FootballPlayer } from "../../../database"
import { Constants, Response } from "../../../utils"
import { secondsFrom, api_duration_seconds } from "../../../metrics"

export const get = async (req, res, next) => {

    // use to measure execution time
    let duration_start = process.hrtime()

    //todo: send metric (footballPlayer.get api call)
    try
    {
        let footballPlayers = await FootballPlayer.findOne()

        let response = {
            version: '',
            footballPlayers: {},
            updated: false,
        }

        if ( !footballPlayers )
        {
            console.error("FootballPlayer object is empty")
            api_duration_seconds.observe({ name: "footballPlayer.get", status: "error", msg: "emptyObject"}, secondsFrom(duration_start))
            res.json(Response.resolve(Constants.OK, response))
        }
        else
        {
            let dbVersion = footballPlayers.version ? parseInt(footballPlayers.version) : 0
            let mobileVersion = req.query.version ? parseInt(req.query.version) : 0

            console.error(`dbVersion: ${dbVersion}`)
            console.error(`mobileVersion: ${mobileVersion}`)
            console.error(`footballPlayers: ${footballPlayers}`);
            console.error(`footballPlayers (obj): ${JSON.stringify(footballPlayers, null, 2)}`);

            response = {
                version: dbVersion,
                footballPlayers: dbVersion === mobileVersion ? {} : footballPlayers.footballPlayers,
                updated: mobileVersion !== dbVersion,
            }
            api_duration_seconds.observe({ name: "footballPlayer.get", status: "success", msg: ""}, secondsFrom(duration_start))
            res.json( Response.resolve(Constants.OK, response) )
        }
    }
    catch (error)
    {
        console.error(error)
        api_duration_seconds.observe({ name: "footballPlayer.get", status: "error", msg: error}, secondsFrom(duration_start))
        res.status(400).send(Response.reject(Constants.BAD_REQUEST, Constants.BAD_REQUEST, error))
    }
}

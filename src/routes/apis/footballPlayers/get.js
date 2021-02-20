
import { FootballPlayer } from "../../../database"
import { Constants, Response } from "../../../utils"
import { secondsFrom, api_duration_seconds } from "../../../metrics"

const get = async (req, res, next) =>
{
    // used to measure execution time
    let duration_start = process.hrtime()

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
            api_duration_seconds.observe({ name: "footballPlayer.get", status: "error", msg: "emptyObject"}, secondsFrom(duration_start))
            
            console.error("FootballPlayer object is empty")
            res.json(Response.resolve(Constants.OK, response))
        }
        else
        {
            let dbVersion = footballPlayers.version ? parseInt(footballPlayers.version) : 0
            let mobileVersion = req.query.version ? parseInt(req.query.version) : 0

            api_duration_seconds.observe({ name: "footballPlayer.get", status: "success", msg: `${Buffer.byteLength(JSON.stringify(response), 'utf8')}`}, secondsFrom(duration_start))

            response = {
                version: dbVersion,
                footballPlayers: dbVersion === mobileVersion ? {} : footballPlayers.footballPlayers,
                updated: mobileVersion !== dbVersion,
            }
            res.json( Response.resolve(Constants.OK, response) )
        }
    }
    catch (error)
    {
        api_duration_seconds.observe({ name: "footballPlayer.get", status: "error", msg: error}, secondsFrom(duration_start))

        console.error('Get FootballPlayers: ', error)
        res.status(400).send( Response.reject(Constants.BAD_REQUEST, Constants.BAD_REQUEST, error, req.headers.language ))
    }
}

export default get
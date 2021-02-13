
import { FootballPlayer } from "../../../database"
import { Constants, Response } from "../../../utils"

export const get = async (req, res, next) => {

    //todo: send metric (footballPlayer.get api call)
    try
    {
        let footballPlayers = FootballPlayer.findOne()

        let response = {
            version: '',
            footballPlayers: {},
            updated: false,
        }

        if ( !footballPlayers )
        {
            //TODO: send metric (footballPlayer API return empty object)

            console.error("FootballPlayer object is empty")
            res.json(Response.resolve(Constants.OK, response))
        }
        else
        {
            let dbVersion = footballPlayers.version ? parseInt(footballPlayers.version) : 0
            let mobileVersion = req.query.version ? parseInt(req.query.version) : 0

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
        console.error(error)
        res.status(400).send(Response.reject(Constants.BAD_REQUEST, Constants.BAD_REQUEST, error))
    }
}

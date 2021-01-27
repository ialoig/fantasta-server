
import { FootballPlayer } from "../../../database"
import { Constants, Response } from "../../../utils"

export const get = async (req, res, next) => {

    //todo: send metric (footballPlayer.get api call)

    FootballPlayer.findOne((error, footballPlayers) => {
        if (error) {
            console.error(error)
            res.status(400).send(Response.reject(Constants.BAD_REQUEST, Constants.BAD_REQUEST, error))
        }
        else if (!footballPlayers) {
            console.error("FootballPlayer object is empty")
            //todo: send metric (footballPlayer API return empty object)
            res.json(Response.resolve(Constants.OK, {}))
        }
        else {
            let dbVersion = footballPlayers.version ? parseInt(footballPlayers.version) : 0
            let mobileVersion = req.query.version ? parseInt(req.query.version) : 0

            let response_obj = {
                version: dbVersion,
                footballPlayers: dbVersion === mobileVersion ? {} : footballPlayers.footballPlayers,
                updated: mobileVersion !== dbVersion,
            }
            res.json(Response.resolve(Constants.OK, response_obj))
        }
    });
}

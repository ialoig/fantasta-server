
import { FootballPlayer } from '../../../database'
import { Constants, Response } from '../../../utils'


/**
 * handle API "fantasta/footballPlayers"
 * use query param "version" to check the freshness of the footballPlayer list on the mobile
 */
export const get = async ( req, res, next ) =>
{
    let footballPlayers = {}
    try
    {
        footballPlayers = await FootballPlayer.getAll()
    }
    catch (error)
    {
        console.error(error)
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, error ) )
    }

    let mobileVersion = parseInt(req.query.version) || 0

    let response_obj = {
        version: footballPlayers.version,
        footballPlayers: footballPlayers.version===mobileVersion ? {} : footballPlayers.footballPlayers,
        updated: mobileVersion===footballPlayers.version
    }

    res.json( Response.resolve(Constants.OK, response_obj) )
}

import { Players } from '../../../database'
import { Constants, Response } from '../../../utils'

export const get = async ( req, res, next ) =>
{
    let players = {}
    try
    {
        players = await Players.getAll()
    }
    catch (error)
    {
        console.error(error)
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, error ) )
    }

    let version = parseInt(req.query.version) || 0
        
    let obj = {
        version: players.version,
        players: players.version>=version ? players.players : {},
        updated: version>=players.version
    }

    res.json( Response.resolve(Constants.OK, obj) )
}
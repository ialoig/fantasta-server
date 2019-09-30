
import { RESPONSE } from '@pinkal/central_utilities'

import { Players } from 'database'
import { Constants } from 'utils'

const get = async ( req, res, next ) =>
{
    var params = req.query;
    
    let players = {}
    try
    {
        players = await Players.getAll()
    }
    catch (error)
    {
        console.error(error)
        res.status(400).send( RESPONSE.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, error ) )
    }

    let version = parseInt(params.version) || 0
        
    let obj = {
        version: players.version,
        players: players.version>=version ? players.players : {},
        updated: version>=players.version
    }

    res.json( RESPONSE.resolve(Constants.OK, obj) )
}

export default get


import { RESPONSE } from '@pinkal/central_utilities'

import { Players } from 'database'
import { Constants } from 'utils'

const get = async ( req, res, next ) =>
{
    var params = req.query;
    if ( params.token && params.version )
    {
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

        let version = parseInt(params.version)
            
        let obj = {
            version: players.version,
            players: players.version>version ? players.players : {},
            updated: version>=players.version
        }

        res.json( RESPONSE.resolve(Constants.OK, obj) )
    }
    else
    {
        res.status(400).send( RESPONSE.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST ) )
    }

}

export default get

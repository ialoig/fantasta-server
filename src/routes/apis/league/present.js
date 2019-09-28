
import { RESPONSE } from '@pinkal/central_utilities'

import { default as DB } from 'database'
import { Constants } from 'utils'

const present = async ( req, res, next ) =>
{
    let params = req.query
    if ( params.name )
    {
        let present = await DB.League.present( params.name )
        
        res.json( !!present );
    }
    else
    {
        res.status(400).send( RESPONSE.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST ) );
    }

}

export default present

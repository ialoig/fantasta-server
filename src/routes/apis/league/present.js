
import { League } from '../../../database'
import { Constants, Response } from '../../../utils'

export const present = async ( req, res, next ) =>
{
    let params = req.query
    if ( params.name )
    {
        let present = await League.present( params.name )
        
        res.json( !!present );
    }
    else
    {
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, null ) );
    }

}
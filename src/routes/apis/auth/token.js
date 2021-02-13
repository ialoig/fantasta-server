
import { Constants, Response } from '../../../utils'

import { userUtils } from '../../../utils'

const token = async ( req, res, next ) =>
{
    //todo: send metric (token api call)
    try
    {
        let auth = await userUtils.userFromToken( req )
        
        let usr = await userUtils.getUser( auth.user )
        let response = {
            user: usr,
            token: auth.token
        }

        res.json( Response.resolve( Constants.OK, response) )
    }
    catch (error)
    {
        console.error('Token: ', error)
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, null ) )   
    }
}

export default token
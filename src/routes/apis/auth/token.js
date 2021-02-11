
import { Constants, Response } from '../../../utils'

import { userUtils } from '../../../utils'

const token = async ( req, res, next ) =>
{
    //todo: send metric (token api call)
    
    let auth = await userUtils.userFromToken( req )
    if ( auth.user && auth.token )
    {
        let usr = await userUtils.getUser( auth.user )
        let response = {
            user: usr,
            token: auth.token
        }

        res.json( Response.resolve( Constants.OK, response) )
    }
    else
    {
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, null ) )
    }
};

export default token

import config from 'config'

import { User } from '../../../database'
import { Constants, Response, userUtils, tokenUtils } from '../../../utils'

const login = async ( req, res, next ) =>
{
    //todo: send metric (login api call)

    let body = req.body || {}
    const { email, password } = body

    if ( email && password )
    {
        try
        {
            let user = await User.findOne({ email })

            if ( !user )
            {
                res.status(404).send( Response.reject( Constants.NOT_FOUND, Constants.USER_NOT_FOUND, null ) )
            }
            else if ( user && user.password && user.password==password )
            {
                delete user.password
                delete user.uuid
                
                let usr = await userUtils.getUser( user )
                let response = {
                    user: usr,
                    token: tokenUtils.Create( config.token.kid, email, password )
                }

                res.json( Response.resolve( Constants.OK, response ) )
            }
            else
            {
                res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.WRONG_PASSWORD, null ) )
            }
        }
        catch (error)
        {
            console.error(error)
            res.status(404).send( Response.reject( Constants.NOT_FOUND, Constants.USER_NOT_FOUND, error ) )
        }
    }
    else
    {
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, null ) )
    }
};

export default login
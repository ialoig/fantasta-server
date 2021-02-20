
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

            if ( !user || !user.$isValid() || user.$isEmpty() )
            {
                console.error('Auth Login: ', Constants.NOT_FOUND)
                res.status(404).send( Response.reject( Constants.NOT_FOUND, Constants.USER_NOT_FOUND, null, req.headers.language ) )
            }
            else if ( user && user.password && user.password==password )
            {
                let usr = await userUtils.getUser( user )
                let response = {
                    user: usr,
                    token: tokenUtils.Create( config.token.kid, email, password, user.username )
                }

                res.json( Response.resolve( Constants.OK, response ) )
            }
            else
            {
                console.error('Auth Login: ', Constants.BAD_REQUEST)
                res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.WRONG_PASSWORD, null, req.headers.language ) )
            }
        }
        catch (error)
        {
            console.error('Auth Login: ', error)
            res.status(404).send( Response.reject( Constants.NOT_FOUND, Constants.USER_NOT_FOUND, error, req.headers.language ) )
        }
    }
    else
    {
        console.error('Auth Login: PARAMS_ERROR')
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.PARAMS_ERROR, null, req.headers.language ) )
    }
}

export default login
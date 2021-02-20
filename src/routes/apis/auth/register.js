
import Validator from 'validator'
import config from 'config'

import { User } from '../../../database'
import { Constants, PASSWORD_OPT, Response, tokenUtils, userUtils } from '../../../utils'

const register = async ( req, res, next ) =>
{
    //todo: send metric (register api call)

    let body = req.body || {}
    const { email, password } = body

    if ( email && password && Validator.isEmail(email) && Validator.isStrongPassword( password, PASSWORD_OPT ) )
    {
        try
        {
            const username = email
            let user = await User.create({ email, password, username })
            
            let usr = await userUtils.getUser( user )
            let response = {
                user: usr,
                token: tokenUtils.Create( config.token.kid, email, password, username )
            }

            res.json( Response.resolve( Constants.OK, response) )
        }
        catch (error)
        {
            console.error('Auth Register: ', error)
            res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.USER_PRESENT, error, req.headers.language ) )
        }
    }
    else
    {
        console.error('Auth Register: PARAMS_ERROR')
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.PARAMS_ERROR, null, req.headers.language ) )
    }
}

export default register
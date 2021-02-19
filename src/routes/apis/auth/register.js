
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
            let name = email;
            let user = await User.create({ email, password, name })
            
            let usr = await userUtils.getUser( user )
            let response = {
                user: usr,
                token: tokenUtils.Create( config.token.kid, email, password )
            }

            res.json( Response.resolve( Constants.OK, response) )
        }
        catch (error)
        {
            console.error('Register: ', error)
            res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.USER_PRESENT, error ) )
        }
    }
    else
    {
        console.error('Register: PARAMS_ERROR')
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, null ) )
    }
}

export default register
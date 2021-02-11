
import Validator from 'validator'
import config from 'config'

import { User } from '../../../database'
import { Constants, PASSWORD_OPT, Response, tokenUtils } from '../../../utils'

const register = async ( req, res, next ) =>
{
    //todo: send metric (register api call)

    let body = req.body || {}
    const { email, password } = body

    if ( email && password && Validator.isEmail(email) && Validator.isStrongPassword( password, PASSWORD_OPT ) )
    {
        try
        {
            let user = await User.create({ email, password })
            
            let usr = await userUtils.getUser( user )
            let response = {
                user: usr,
                token: tokenUtils.Create( config.token.kid, email, password )
            }

            res.json( Response.resolve( Constants.OK, response) )
        }
        catch (error)
        {
            console.error(error)
            res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.USER_PRESENT, error ) )
        }
    }
    else
    {
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, null ) )
    }
}

export default register
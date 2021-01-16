
import Validator from 'validator'
import config from 'config'

import { User } from '../../../database'
import { Constants, PASSWORD_OPT, Response } from '../../../utils'
import { Create } from '../../../token'

const register = async ( req, res, next ) =>
{
    let body = req.body || {}
    const { email, password } = body

    if ( email && password && Validator.isEmail(email) && Validator.isStrongPassword( password, PASSWORD_OPT ) )
    {
        let newUser = User({ email, password })

        try
        {
            await newUser.save()
        }
        catch (error)
        {
            console.error(error)
            res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.USER_PRESENT, error ) )
        }
        
        let data = {
            token: Create( config.token.kid, email, password )
        }
        res.json( Response.resolve( Constants.OK, data) )
    }
    else
    {
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, null ) )
    }
}

export default register
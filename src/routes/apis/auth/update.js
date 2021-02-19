
import Validator from 'validator'
import config from 'config'

import { Constants, Response, userUtils, tokenUtils } from '../../../utils'

const update = async ( req, res, next ) =>
{
    const { email, username } = req.body

    if ( username || email && Validator.isEmail(email) )
    {
        try {
            const auth = await userUtils.userFromToken(req)
            const user = auth.user
            const userID = user._id
    
            let newValues = {}
            if ( email )
            {
                newValues.email = email
            }
            else if ( username )
            {
                newValues.username = username
            }
    
            let updatedUser = await userUtils.findAndUpdateUser(userID, newValues)
            
            let usr = await userUtils.getUser( updatedUser )
            
            let response = {
                user: usr,
                token: tokenUtils.Create( config.token.kid, updatedUser.email, updatedUser.password )
            }
            return res.json( Response.resolve( Constants.OK, response ) )
        }
        catch ( error )
        {
            console.error('Auth Update: ', error)
            res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, error ) )
        }
    }
    else
    {
        console.error('Auth Update: PARAMS_ERROR')
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, null ) )
    }
}

export default update
import Validator from 'validator'

import { User } from '../../../database'
import { errorMetric, saveMetric } from "../../../metrics"
import { Constants, Response, userUtils } from '../../../utils'

const update = async ( req, res, next ) =>
{
    const duration_start = process.hrtime()

    const { email='', username='' } = req.body
    if ( username || email && Validator.isEmail(email) )
    {
        try
        {
            const auth = await userUtils.userFromToken(req)
            const user = auth.user
            const userID = user._id
    
            let newValues = {}
            if ( email ) {
                newValues.email = email
            }
            else if ( username )
            {
                newValues.username = username
            }
    
            let updatedUser = await User.findByIdAndUpdate({_id: userID}, newValues, {new: true, useFindAndModify: false});
            
            let response = await userUtils.createAuthResponse( updatedUser, updatedUser.password )

            saveMetric( "auth.update", '', duration_start )
            
            return res.json( Response.resolve( Constants.OK, response ) )
        }
        catch ( error )
        {
            errorMetric( "auth.update", Constants[error] || Constants.BAD_REQUEST, duration_start )
            
            console.error('Auth Update: ', error)
            res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants[error] || Constants.BAD_REQUEST, error, req.headers.language ) )
        }
    }
    else
    {
        errorMetric( "auth.update", Constants.PARAMS_ERROR, duration_start )

        console.error('Auth Update: PARAMS_ERROR')
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.PARAMS_ERROR, null, req.headers.language ) )
    }
}

export default update
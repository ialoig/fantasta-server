import Validator from 'validator'
import config from 'config'

import { User } from '../../../database'
import { secondsFrom, METRIC_STATUS, api_duration_seconds } from "../../../metrics"
import { Constants, Response, userUtils, tokenUtils } from '../../../utils'

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
            
            let usr = await userUtils.getUser( updatedUser )
            let response = {
                user: usr,
                token: tokenUtils.Create( config.token.kid, updatedUser.email, updatedUser.password, updatedUser.username )
            }

            api_duration_seconds.observe({ name: "auth.update", status: METRIC_STATUS.SUCCESS, msg: ""}, secondsFrom(duration_start))
            
            return res.json( Response.resolve( Constants.OK, response ) )
        }
        catch ( error )
        {
            api_duration_seconds.observe({ name: "auth.update", status: METRIC_STATUS.ERROR, msg: Constants[error] || Constants.BAD_REQUEST}, secondsFrom(duration_start))
            
            console.error('Auth Update: ', error)
            res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants[error] || Constants.BAD_REQUEST, error, req.headers.language ) )
        }
    }
    else
    {
        api_duration_seconds.observe({ name: "auth.update", status: METRIC_STATUS.ERROR, msg: Constants.PARAMS_ERROR}, secondsFrom(duration_start))

        console.error('Auth Update: PARAMS_ERROR')
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.PARAMS_ERROR, null, req.headers.language ) )
    }
}

export default update
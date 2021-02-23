
import Validator from 'validator'
import config from 'config'

import { User } from '../../../database'
import { secondsFrom, METRIC_STATUS, api_duration_seconds } from "../../../metrics"
import { Constants, PASSWORD_OPT, Response, tokenUtils, userUtils } from '../../../utils'

const register = async ( req, res, next ) =>
{
    const duration_start = process.hrtime()

    const { email='', password='' } = req.body
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

            api_duration_seconds.observe({ name: "auth.register", status: METRIC_STATUS.SUCCESS, msg: ""}, secondsFrom(duration_start))

            res.json( Response.resolve( Constants.OK, response) )
        }
        catch (error)
        {
            api_duration_seconds.observe({ name: "auth.register", status: METRIC_STATUS.ERROR, msg: Constants[error] || Constants.BAD_REQUEST}, secondsFrom(duration_start))

            console.error('Auth Register: ', error)
            res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.USER_PRESENT, error, req.headers.language ) )
        }
    }
    else
    {
        api_duration_seconds.observe({ name: "auth.register", status: METRIC_STATUS.ERROR, msg: Constants.PARAMS_ERROR}, secondsFrom(duration_start))

        console.error('Auth Register: PARAMS_ERROR')
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.PARAMS_ERROR, null, req.headers.language ) )
    }
}

export default register
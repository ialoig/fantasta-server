
import config from 'config'

import { User } from '../../../database'
import { secondsFrom, METRIC_STATUS, api_duration_seconds } from "../../../metrics"
import { Constants, Response, userUtils, tokenUtils } from '../../../utils'

const login = async ( req, res, next ) =>
{
    const duration_start = process.hrtime()

    const { email='', password='' } = req.body
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
            else if ( user.password==password )
            {
                let usr = await userUtils.getUser( user )
                let response = {
                    user: usr,
                    token: tokenUtils.Create( config.token.kid, email, password, user.username )
                }

                api_duration_seconds.observe({ name: "auth.login", status: METRIC_STATUS.SUCCESS, msg: ""}, secondsFrom(duration_start))

                res.json( Response.resolve( Constants.OK, response ) )
            }
            else
            {
                api_duration_seconds.observe({ name: "auth.login", status: METRIC_STATUS.ERROR, msg: Constants.WRONG_PASSWORD}, secondsFrom(duration_start))

                console.error('Auth Login: ', Constants.BAD_REQUEST)
                res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.WRONG_PASSWORD, null, req.headers.language ) )
            }
        }
        catch (error)
        {
            api_duration_seconds.observe({ name: "auth.login", status: METRIC_STATUS.ERROR, msg: Constants[error] || Constants.BAD_REQUEST}, secondsFrom(duration_start))

            console.error('Auth Login: ', error)
            res.status(404).send( Response.reject( Constants.NOT_FOUND, Constants.USER_NOT_FOUND, error, req.headers.language ) )
        }
    }
    else
    {
        api_duration_seconds.observe({ name: "auth.login", status: METRIC_STATUS.ERROR, msg: Constants.PARAMS_ERROR}, secondsFrom(duration_start))

        console.error('Auth Login: PARAMS_ERROR')
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.PARAMS_ERROR, null, req.headers.language ) )
    }
}

export default login
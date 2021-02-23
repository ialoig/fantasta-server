
import { Constants, Response, userUtils } from '../../../utils'
import { secondsFrom, METRIC_STATUS, api_duration_seconds } from "../../../metrics"

const token = async ( req, res, next ) =>
{
    const duration_start = process.hrtime()

    try
    {
        let auth = await userUtils.userFromToken( req )
        let usr = await userUtils.getUser( auth.user )
        let response = {
            user: usr,
            token: auth.token
        }

        api_duration_seconds.observe({ name: "auth.token", status: METRIC_STATUS.SUCCESS, msg: ""}, secondsFrom(duration_start))

        res.json( Response.resolve( Constants.OK, response) )
    }
    catch (error)
    {
        api_duration_seconds.observe({ name: "auth.token", status: METRIC_STATUS.ERROR, msg: Constants[error] || Constants.BAD_REQUEST}, secondsFrom(duration_start))

        console.error('Auth Token: ', error)
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, error, req.headers.language ) )   
    }
}

export default token

import { Constants, Response, userUtils } from '../../../utils'
import { secondsFrom, METRIC_STATUS, api_duration_seconds } from "../../../metrics"

/** 
 * @route DELETE api/auth/deleteAccount
* */
const deleteAccount = async (req, res, next) =>
{
    const duration_start = process.hrtime()

    const { password='' } = req.body
    if ( password )
    {
        try
        {
            const auth = await userUtils.userFromToken(req);
            const user = auth.user;
            
            if ( user.password!=password )
            {
                api_duration_seconds.observe({ name: "auth.delete", status: METRIC_STATUS.ERROR, msg: Constants.WRONG_PASSWORD}, secondsFrom(duration_start))

                console.error("Auth Delete: ", Constants.WRONG_PASSWORD)
                res.status(404).send( Response.reject( Constants.BAD_REQUEST, Constants.WRONG_PASSWORD, null, req.headers.language ) )
            } 
            else
            {
                api_duration_seconds.observe({ name: "auth.delete", status: METRIC_STATUS.SUCCESS, msg: ""}, secondsFrom(duration_start))

                //user.remove();
            }
        }
        catch (error)
        {
            api_duration_seconds.observe({ name: "auth.delete", status: METRIC_STATUS.ERROR, msg: Constants[error] || Constants.BAD_REQUEST}, secondsFrom(duration_start))

            console.log("Auth Delete: ", error)
            res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, error, req.headers.language ) )
        }
    }
    else
    {
        api_duration_seconds.observe({ name: "auth.delete", status: METRIC_STATUS.ERROR, msg: Constants.PARAMS_ERROR}, secondsFrom(duration_start))

        console.error('Auth Delete: PARAMS_ERROR')
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.PARAMS_ERROR, null, req.headers.language ) )
    }
}

export default deleteAccount
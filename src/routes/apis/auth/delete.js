
import { Constants, Response, userUtils } from '../../../utils'
import { errorMetric, saveMetric } from "../../../metrics"

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
                errorMetric( "auth.delete", Constants.WRONG_PASSWORD, duration_start )

                console.error("Auth Delete: ", Constants.WRONG_PASSWORD)
                res.status(404).send( Response.reject( Constants.BAD_REQUEST, Constants.WRONG_PASSWORD, null, req.headers.language ) )
            } 
            else
            {
                saveMetric( "auth.delete", '', duration_start )

                //user.remove();
            }
        }
        catch (error)
        {
            errorMetric( "auth.delete", Constants[error] || Constants.BAD_REQUEST, duration_start )

            console.log("Auth Delete: ", error)
            res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.BAD_REQUEST, error, req.headers.language ) )
        }
    }
    else
    {
        errorMetric( "auth.delete", Constants.PARAMS_ERROR, duration_start )

        console.error('Auth Delete: PARAMS_ERROR')
        res.status(400).send( Response.reject( Constants.BAD_REQUEST, Constants.PARAMS_ERROR, null, req.headers.language ) )
    }
}

export default deleteAccount
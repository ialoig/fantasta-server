
import { Constants, Response, userUtils } from '../../../utils/index.js'
import { metricApiError, metricApiSuccess } from '../../../metrics/index.js'

/** 
 * @route DELETE api/auth/deleteAccount
* */
const deleteAccount = async (req, res, next) => {
    const duration_start = process.hrtime()

    const { password = '' } = req.body
    if (password) {
        try {
            const auth = await userUtils.userFromToken(req);
            const user = auth.user;

            if (user.password != password) {
                console.error("Auth Delete: ", Constants.WRONG_PASSWORD)
                metricApiError("auth.delete", Constants.WRONG_PASSWORD, duration_start)
                res.status(400).send(Response.reject(Constants.BAD_REQUEST, Constants.WRONG_PASSWORD, null, req.headers.language))
            }
            else {
                metricApiSuccess("auth.delete", '', duration_start)
                //user.remove();
                res.json(Response.resolve(Constants.OK, true))
            }
        }
        catch (error) {
            console.log("Auth Delete: ", error)
            metricApiError("auth.delete", Constants[error] || Constants.BAD_REQUEST, duration_start)
            res.status(404).send(Response.reject(Constants.BAD_REQUEST, Constants[error] || Constants.BAD_REQUEST, error, req.headers.language))
        }
    }
    else {
        console.error('Auth Delete: PARAMS_ERROR')
        metricApiError("auth.delete", Constants.PARAMS_ERROR, duration_start)
        res.status(400).send(Response.reject(Constants.BAD_REQUEST, Constants.PARAMS_ERROR, null, req.headers.language))
    }
}

export default deleteAccount

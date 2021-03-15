import { Constants, Response, userUtils } from '../../../utils'
import { metricApiError, metricApiSuccess } from '../../../metrics'

const token = async (req, res, next) => {
    const duration_start = process.hrtime()

    try {
        let auth = await userUtils.userFromToken(req)

        let response = await userUtils.createAuthResponse(auth.user, auth.user.password)

        metricApiSuccess("auth.token", '', duration_start)

        res.json(Response.resolve(Constants.OK, response))
    }
    catch (error) {
        console.error('Auth Token: ', error)
        metricApiError("auth.token", Constants[error] || Constants.BAD_REQUEST, duration_start)
        res.status(400).send(Response.reject(Constants.BAD_REQUEST, Constants[error] || Constants.BAD_REQUEST, error, req.headers.language))
    }
}

export default token

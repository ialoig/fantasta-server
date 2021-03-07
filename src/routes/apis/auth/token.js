import { Constants, Response, userUtils } from '../../../utils/index.js'
import { metricApiError, metricApiSuccess } from '../../../metrics/index.js'

const token = async (req, res, next) => {
    const duration_start = process.hrtime()

    try {
        let auth = await userUtils.userFromToken(req)
        let usr = await userUtils.getUser(auth.user)
        let response = {
            user: usr,
            token: auth.token
        }

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

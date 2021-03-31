import { Errors, Response, userUtils } from '../../../utils'
import { metricApiError, metricApiSuccess } from '../../../metrics'

const token = async (req, res, next) => {
    const duration_start = process.hrtime()

    try {
        let auth = await userUtils.userFromToken(req)

        let response = await userUtils.createAuthResponse(auth.user, auth.user.password)

        metricApiSuccess("auth.token", '', duration_start)

        res.json(Response.resolve(response))
    }
    catch (error) {
        console.error(`[api] auth.token: ${error}`)
        metricApiError("auth.token", error, duration_start)
        res.status(400).send(Response.reject(error, req.headers.language))
    }
}

export default token

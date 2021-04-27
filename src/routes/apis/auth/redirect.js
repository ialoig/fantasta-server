import { metricApiError, metricApiSuccess } from '../../../metrics'
import { Errors, Response, userUtils } from '../../../utils'

const redirect = async (req, res, next) => {
    const duration_start = process.hrtime()

    const { token } = req.body
    if (token) {

        console.log(`token = ${token}`)
        let url = "exp://192.168.0.154:19000/--/ResetPassword?email=user01@email.com"

        try {
            console.log(`redirecting to "${url}"`)
            res.redirect(url)
        }
        catch (error) {
            console.error(`[api] auth.redirect: ${error}`)
            metricApiError("auth.redirect", error, duration_start)
            res.status(400).send(Response.reject(error, req.headers.language))
        }
    }
    else {
        console.error(`[api] auth.redirect: ${Errors.PARAMS_ERROR.status}`)
        metricApiError("auth.redirect", Errors.PARAMS_ERROR, duration_start)
        res.status(400).send(Response.reject(Errors.PARAMS_ERROR, req.headers.language))
    }
}

export default redirect

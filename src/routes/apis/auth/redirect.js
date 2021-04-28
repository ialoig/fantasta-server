import { metricApiError, metricApiSuccess } from '../../../metrics'
import { Reset, User } from '../../../database'
import { Errors, Response } from '../../../utils'
const mongoose = require('mongoose');

const redirect = async (req, res, next) => {
    const duration_start = process.hrtime()

    const id = req.query.id

    if (id && mongoose.Types.ObjectId.isValid(id)) {
        try {
            // search for the pending reset id
            const reset = await Reset.findById({ _id: mongoose.Types.ObjectId(id) })
            if (!reset) {
                console.error(`[api] auth.redirect: ${Errors.RESET_EXPIRED.status}`)
                metricApiError("auth.redirect", Errors.RESET_EXPIRED, duration_start)
                res.status(400).send(Response.reject(Errors.RESET_EXPIRED, req.headers.language))
            }
            else {
                // retrieve user that made the reset request
                const user = await User.findById({ _id: reset.user })
                if (!user) {
                    console.error(`[api] auth.redirect: ${Errors.USER_NOT_FOUND.status}`)
                    metricApiError("auth.redirect", Errors.USER_NOT_FOUND, duration_start)
                    res.status(400).send(Response.reject(Errors.USER_NOT_FOUND, req.headers.language))
                }
                else {
                    const email = user.email
                    const url = `exp://192.168.0.154:19000/--/ResetPassword?email=${email}`
                    console.log(`redirecting to "${url}"`)
                    metricApiSuccess("auth.redirect", '', duration_start)
                    res.redirect(url)
                }
            }
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

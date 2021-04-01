import Validator from 'validator'
import { User } from '../../../database'
import { metricApiError, metricApiSuccess } from '../../../metrics'
import { Errors, Response } from '../../../utils'
import { sendEmail } from '../../../utils'

const forgot = async (req, res, next) => {
    const duration_start = process.hrtime()

    const { email = '' } = req.body
    if (email && Validator.isEmail(email)) {
        try {
            let user = await User.findOne({ email })

            if (!user || !user.$isValid() || user.$isEmpty()) {
                console.error(`[api] auth.forgot: ${Errors.EMAIL_NOT_FOUND.status}`)
                metricApiError("auth.forgot", Errors.EMAIL_NOT_FOUND, duration_start)
                res.status(404).send(Response.reject(Errors.EMAIL_NOT_FOUND, req.headers.language))
            }
            else if (user.email == email) {

                let newPassword = '123456'
                let _text = 'Nuova password: ' + newPassword

                sendEmail(email, 'Cambio password', _text)

                metricApiSuccess("auth.forgot", '', duration_start)

                res.json(Response.resolve({}))
            }
            else {
                console.error(`[api] auth.forgot: ${Errors.EMAIL_NOT_FOUND.status}`)
                metricApiError("auth.forgot", Errors.EMAIL_NOT_FOUND, duration_start)
                res.status(400).send(Response.reject(Errors.EMAIL_NOT_FOUND, req.headers.language))
            }
        }
        catch (error) {
            console.error(`[api] auth.forgot: ${error}`)
            metricApiError("auth.forgot", error, duration_start)
            res.status(404).send(Response.reject(error, req.headers.language))
        }
    }
    else {
        console.error(`[api] auth.forgot: ${Errors.PARAMS_ERROR.status}`)
        metricApiError("auth.forgot", Errors.PARAMS_ERROR, duration_start)
        res.status(400).send(Response.reject(Errors.PARAMS_ERROR, req.headers.language))
    }
}

export default forgot

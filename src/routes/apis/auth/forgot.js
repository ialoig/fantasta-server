import Validator from 'validator'
import generator from 'generate-password'

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

            if (user && user.$isValid() && user.email == email) {
                let newPassword = generator.generate({
                    length: 10,
                    numbers: true
                })

                let subject = 'Cambio password'
                let _text = 'Nuova password: ' + newPassword

                // todo: update password for user
                let emailStatus = await sendEmail(email, subject, _text)
                console.log(`[api] auth.forgot: emailStatus: ${emailStatus}`)
                metricApiSuccess("auth.forgot", '', duration_start)
            }
            else {
                console.error(`[api] auth.forgot: ${Errors.EMAIL_NOT_FOUND.status}`)
                metricApiError("auth.forgot", Errors.EMAIL_NOT_FOUND, duration_start)
            }
        }
        catch (error) {
            console.error(`[api] auth.forgot: ${error}`)
            metricApiError("auth.forgot", error, duration_start)
            res.status(400).send(Response.reject(error, req.headers.language))
        }
        res.json(Response.resolve())
    }
    else {
        console.error(`[api] auth.forgot: ${Errors.EMAIL_ERROR.status}`)
        metricApiError("auth.forgot", Errors.EMAIL_ERROR, duration_start)
        res.status(400).send(Response.reject(Errors.EMAIL_ERROR, req.headers.language))
    }
}

export default forgot

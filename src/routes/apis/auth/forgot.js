import Validator from 'validator'
import { User } from '../../../database'
import { metricApiError, metricApiSuccess } from '../../../metrics'
import { Constants, Response } from '../../../utils'
import { sendEmail } from '../../../utils'

const forgot = async (req, res, next) => {
    const duration_start = process.hrtime()

    const { email = '' } = req.body
    if (email && Validator.isEmail(email)) {
        try {
            let user = await User.findOne({ email })

            if (!user || !user.$isValid() || user.$isEmpty()) {
                console.error('Auth Forgot: ', Constants.NOT_FOUND)
                metricApiError("auth.forgot", Constants.NOT_FOUND, duration_start)
                res.status(404).send(Response.reject(Constants.NOT_FOUND, Constants.USER_NOT_FOUND, null, req.headers.language))
            }
            else if (user.email == email) {

                let newPassword = '123456'
                let _text = 'Nova password: ' + newPassword

                sendEmail(email, 'Cambio password', _text)
                
                metricApiSuccess("auth.forgot", '', duration_start)

                res.json(Response.resolve(Constants.OK, {}))
            }
            else {
                console.error('Auth Forgot: ', Constants.BAD_REQUEST)
                metricApiError("auth.forgot", Constants.WRONG_PASSWORD, duration_start)
                res.status(400).send(Response.reject(Constants.BAD_REQUEST, Constants.WRONG_PASSWORD, null, req.headers.language))
            }
        }
        catch (error) {
            console.error('Auth Forgot: ', error)
            metricApiError("auth.forgot", Constants[error] || Constants.BAD_REQUEST, duration_start)
            res.status(404).send(Response.reject(Constants.NOT_FOUND, Constants[error] || Constants.BAD_REQUEST, error, req.headers.language))
        }
    }
    else {
        console.error('Auth Forgot: PARAMS_ERROR')
        metricApiError("auth.forgot", Constants.PARAMS_ERROR, duration_start)
        res.status(400).send(Response.reject(Constants.BAD_REQUEST, Constants.PARAMS_ERROR, null, req.headers.language))
    }
}

export default forgot


import Validator from 'validator'

import { User } from '../../../database'
import { metricApiError, metricApiSuccess } from "../../../metrics"
import { Constants, PASSWORD_OPT, Response, userUtils } from '../../../utils'

const register = async (req, res, next) => {
    const duration_start = process.hrtime()

    const { email = '', password = '' } = req.body
    if (email && Validator.isEmail(email) && password && Validator.isStrongPassword(password, PASSWORD_OPT)) {
        try {
            const username = email
            let user = await User.create({ email, password, username })

            let response = await userUtils.createAuthResponse(user, password)

            metricApiSuccess("auth.register", '', duration_start)

            res.json(Response.resolve(Constants.OK, response))
        }
        catch (error) {
            let code = error.code && Constants[error.code] ? Constants[error.code] : Constants[error] || Constants.BAD_REQUEST
            console.error('Auth Register: ', error)
            metricApiError("auth.register", code, duration_start)
            res.status(400).send(Response.reject(code, code, error, req.headers.language))
        }
    }
    else {
        console.error('Auth Register: PARAMS_ERROR')
        metricApiError("auth.register", Constants.PARAMS_ERROR, duration_start)
        res.status(400).send(Response.reject(Constants.BAD_REQUEST, Constants.PARAMS_ERROR, null, req.headers.language))
    }
}

export default register
import Validator from 'validator'
import { User } from '../../../database/index.js'
import { metricApiError, metricApiSuccess } from '../../../metrics/index.js'
import { Constants, PASSWORD_OPT, Response, userUtils } from '../../../utils/index.js'

const login = async (req, res, next) => {
    const duration_start = process.hrtime()

    const { email = '', password = '' } = req.body
    if (email && Validator.isEmail(email) && password && Validator.isStrongPassword(password, PASSWORD_OPT)) {
        try {
            let user = await User.findOne({ email })

            if (!user || !user.$isValid() || user.$isEmpty()) {
                console.error('Auth Login: ', Constants.NOT_FOUND)
                metricApiError("auth.login", Constants.NOT_FOUND, duration_start)
                res.status(404).send(Response.reject(Constants.NOT_FOUND, Constants.USER_NOT_FOUND, null, req.headers.language))
            }
            else if (user.password == password) {
                let response = await userUtils.createAuthResponse(user, password)
                metricApiSuccess("auth.login", '', duration_start)
                res.json(Response.resolve(Constants.OK, response))
            }
            else {
                console.error('Auth Login: ', Constants.BAD_REQUEST)
                metricApiError("auth.login", Constants.WRONG_PASSWORD, duration_start)
                res.status(400).send(Response.reject(Constants.BAD_REQUEST, Constants.WRONG_PASSWORD, null, req.headers.language))
            }
        }
        catch (error) {
            console.error('Auth Login: ', error)
            metricApiError("auth.login", Constants[error] || Constants.BAD_REQUEST, duration_start)
            res.status(404).send(Response.reject(Constants.NOT_FOUND, Constants[error] || Constants.BAD_REQUEST, error, req.headers.language))
        }
    }
    else {
        console.error('Auth Login: PARAMS_ERROR')
        metricApiError("auth.login", Constants.PARAMS_ERROR, duration_start)
        res.status(400).send(Response.reject(Constants.BAD_REQUEST, Constants.PARAMS_ERROR, null, req.headers.language))
    }
}

export default login

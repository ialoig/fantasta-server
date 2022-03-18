import Validator from "validator"
import { User } from "../../../database"
import { metricApiError, metricApiSuccess } from "../../../metrics"
import { Errors, PASSWORD_OPT, Response, userUtils } from "../../../utils"

// eslint disabled for 'next' params - it has to be defined even if not used
// eslint-disable-next-line no-unused-vars
const login = async (req, res, next) => {
	const duration_start = process.hrtime()

	const { email = "", password = "" } = req.body
	if (email && Validator.isEmail(email) && password && Validator.isStrongPassword(password, PASSWORD_OPT)) {
		try {
			let user = await User.findOne({ email })

			if (!user || !user.$isValid() || user.$isEmpty()) {
				console.error(`[api] auth.login: ${Errors.EMAIL_NOT_FOUND.status}`)
				metricApiError("auth.login", Errors.EMAIL_NOT_FOUND, duration_start)
				res.status(404).send(Response.reject(Errors.EMAIL_PASSWORD_ERROR, req.headers.language))
			}
			else if (user.password == password) {
				let response = await userUtils.createAuthResponse(user, password)
				metricApiSuccess("auth.login", "", duration_start)
				res.json(Response.resolve(response))
			}
			else {
				console.error(`[api] auth.login: ${Errors.PASSWORD_ERROR.status}`)
				metricApiError("auth.login", Errors.PASSWORD_ERROR, duration_start)
				res.status(400).send(Response.reject(Errors.EMAIL_PASSWORD_ERROR, req.headers.language))
			}
		}
		catch (error) {
			console.error(`[api] auth.login: ${error}`)
			metricApiError("auth.login", error, duration_start)
			res.status(404).send(Response.reject(Errors.EMAIL_PASSWORD_ERROR, req.headers.language))
		}
	}
	else if ( !email || !Validator.isEmail(email) )
	{
		console.error(`[api] auth.login: ${Errors.EMAIL_ERROR.status}`)
		metricApiError("auth.login", Errors.EMAIL_ERROR, duration_start)
		res.status(400).send(Response.reject(Errors.EMAIL_ERROR, req.headers.language))
	}
	else if ( !password || !Validator.isStrongPassword(password, PASSWORD_OPT) )
	{
		console.error(`[api] auth.login: ${Errors.PASSWORD_ERROR.status}`)
		metricApiError("auth.login", Errors.PASSWORD_ERROR, duration_start)
		res.status(400).send(Response.reject(Errors.PASSWORD_ERROR, req.headers.language))
	}
	else
	{
		console.error(`[api] auth.login: ${Errors.PARAMS_ERROR.status}`)
		metricApiError("auth.login", Errors.PARAMS_ERROR, duration_start)
		res.status(400).send(Response.reject(Errors.PARAMS_ERROR, req.headers.language))
	}
}

export default login

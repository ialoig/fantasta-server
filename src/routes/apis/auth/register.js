import Validator from "validator"
import { User } from "../../../database"
import { metricApiError, metricApiSuccess } from "../../../metrics"
import { Errors, PASSWORD_OPT, Response, userUtils } from "../../../utils"

const register = async (req, res, next) => {
	const duration_start = process.hrtime()

	const { email = "", password = "" } = req.body
	if (email && Validator.isEmail(email) && password && Validator.isStrongPassword(password, PASSWORD_OPT)) {
		try {
			const username = email
			let user = await User.create({ email, password, username })

			let response = await userUtils.createAuthResponse(user, password)

			metricApiSuccess("auth.register", "", duration_start)

			res.json(Response.resolve(response))
		}
		catch (error) {
			// Mongo duplicate key Error
			if (error.name === "MongoError" && error.code === 11000) {
				console.error(`[api] auth.register: ${Errors.EMAIL_ALREADY_EXISTS.status}`)
				metricApiError("auth.register", Errors.EMAIL_ALREADY_EXISTS, duration_start)
				res.status(400).send(Response.reject(Errors.EMAIL_ALREADY_EXISTS, req.headers.language))
			}
			else {
				console.error(`[api] auth.register: ${error}`)
				metricApiError("auth.register", error, duration_start)
				res.status(400).send(Response.reject(error, req.headers.language))
			}
		}
	}
	else if ( !email || !Validator.isEmail(email) )
	{
		console.error(`[api] auth.register: ${Errors.EMAIL_ERROR.status}`)
		metricApiError("auth.register", Errors.EMAIL_ERROR, duration_start)
		res.status(400).send(Response.reject(Errors.EMAIL_ERROR, req.headers.language))
	}
	else if ( !password || !Validator.isStrongPassword(password, PASSWORD_OPT) )
	{
		console.error(`[api] auth.register: ${Errors.PASSWORD_ERROR.status}`)
		metricApiError("auth.register", Errors.PASSWORD_ERROR, duration_start)
		res.status(400).send(Response.reject(Errors.PASSWORD_ERROR, req.headers.language))
	}
	else
	{
		console.error(`[api] auth.register: ${Errors.PARAMS_ERROR.status}`)
		metricApiError("auth.register", Errors.PARAMS_ERROR, duration_start)
		res.status(400).send(Response.reject(Errors.PARAMS_ERROR, req.headers.language))
	}
}

export default register

import Validator from "validator"
import { Reset, User } from "../../../database"
import { metricApiError, metricApiSuccess } from "../../../metrics"
import { Errors, PASSWORD_OPT, Response, userUtils } from "../../../utils"

// eslint disabled for 'next' params - it has to be defined even if not used
// eslint-disable-next-line no-unused-vars
const resetPassword = async (req, res, next) => {
	const duration_start = process.hrtime()

	const { email = "", password = "" } = req.body

	if (email && Validator.isEmail(email) && password && Validator.isStrongPassword(password, PASSWORD_OPT)) {
		try {
			let updatedUser = await User.findOneAndUpdate({ email: email }, { password: password }, { new: true, useFindAndModify: false })
			if (updatedUser) {
				let response = await userUtils.createAuthResponse(updatedUser, updatedUser.password) //todo: why accept password?
				await Reset.findOneAndRemove({ user: updatedUser._id })
				metricApiSuccess("auth.resetPassword", "", duration_start)
				res.json(Response.resolve(response))
			}
			else {
				console.error(`[api] auth.resetPassword: ${Errors.EMAIL_NOT_FOUND.status}`)
				metricApiError("auth.resetPassword", Errors.EMAIL_NOT_FOUND, duration_start)
				res.status(400).send(Response.reject(Errors.EMAIL_NOT_FOUND, req.headers.language))
			}
		}
		catch (error) {
			console.error(`[api] auth.resetPassword: ${error}`)
			metricApiError("auth.resetPassword", error, duration_start)
			res.status(400).send(Response.reject(error, req.headers.language))
		}
	}
	else {
		console.error(`[api] auth.resetPassword: ${Errors.PARAMS_ERROR.status}`)
		metricApiError("auth.resetPassword", Errors.PARAMS_ERROR, duration_start)
		res.status(400).send(Response.reject(Errors.PARAMS_ERROR, req.headers.language))
	}
}

export default resetPassword

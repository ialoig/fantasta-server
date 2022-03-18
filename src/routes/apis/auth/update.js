import Validator from "validator"
import { User } from "../../../database"
import { metricApiError, metricApiSuccess } from "../../../metrics"
import { Errors, PASSWORD_OPT, Response, userUtils } from "../../../utils"

// eslint disabled for 'next' params - it has to be defined even if not used
// eslint-disable-next-line no-unused-vars
const update = async (req, res, next) => {
	const duration_start = process.hrtime()

	const { email = "", username = "", password = "" } = req.body
	if (username || email && Validator.isEmail(email) || password && Validator.isStrongPassword(password, PASSWORD_OPT)) {
		try {
			const auth = await userUtils.userFromToken(req)
			const user = auth.user
			const userID = user._id

			let newValues = {}
			if (username) {
				newValues.username = username
			}
			if (email && Validator.isEmail(email)) {
				newValues.email = email
			}
			if (password && Validator.isStrongPassword(password, PASSWORD_OPT)) {
				newValues.password = password
			}

			let updatedUser = await User.findByIdAndUpdate({ _id: userID }, newValues, { new: true, useFindAndModify: false })
			let response = await userUtils.createAuthResponse(updatedUser, updatedUser.password)
			metricApiSuccess("auth.update", "", duration_start)

			res.json(Response.resolve(response))
		}
		catch (error) {
			console.error(`[api] auth.update: ${error}`)
			metricApiError("auth.update", error, duration_start)
			res.status(400).send(Response.reject(error, req.headers.language))
		}
	}
	else {
		console.error(`[api] auth.update: ${Errors.PARAMS_ERROR.status}`)
		metricApiError("auth.update", Errors.PARAMS_ERROR, duration_start)
		res.status(400).send(Response.reject(Errors.PARAMS_ERROR, req.headers.language))
	}
}

export default update

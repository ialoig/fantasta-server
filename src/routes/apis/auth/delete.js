import { metricApiError, metricApiSuccess } from "../../../metrics"
import { Errors, Response, userUtils } from "../../../utils"

/** 
 * @route DELETE api/auth/deleteAccount
* */
const deleteAccount = async (req, res, next) => {
	const duration_start = process.hrtime()

	const { password = "" } = req.body
	if (password) {
		try {
			const auth = await userUtils.userFromToken(req)
			const user = auth.user

			if (user.password != password) {
				console.error(`[api] auth.delete: ${Errors.WRONG_PASSWORD.status}`)
				metricApiError("auth.delete", Errors.WRONG_PASSWORD, duration_start)
				res.status(400).send(Response.reject(Errors.WRONG_PASSWORD, req.headers.language))
			}
			else {
				metricApiSuccess("auth.delete", "", duration_start)
				await userUtils.removeUser(user)
				res.json(Response.resolve(true))
			}
		}
		catch (error) {
			console.error(`[api] auth.delete: ${error}`)
			metricApiError("auth.delete", error, duration_start)
			res.status(404).send(Response.reject(error, req.headers.language))
		}
	}
	else {
		console.error(`[api] auth.delete: ${Errors.PASSWORD_ERROR.status}`)
		metricApiError("auth.delete", Errors.PASSWORD_ERROR, duration_start)
		res.status(400).send(Response.reject(Errors.PASSWORD_ERROR, req.headers.language))
	}
}

export default deleteAccount

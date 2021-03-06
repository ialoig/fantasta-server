import config from "config"
import I18n from "i18n-js"
import { Reset, User } from "../../../database"
import { getLanguage } from "../../../languages"
import { metricApiError, metricApiSuccess } from "../../../metrics"
import { Errors } from "../../../utils"
const mongoose = require("mongoose")

function getResetPasswordPageUrl(email) {
	const resetPasswordPage_url = `${config.app.prefix}${config.app.resetPasswordPage}?email=${email}`
	console.log(`[api] auth.redirect: redirecting to "${resetPasswordPage_url}"`)
	return resetPasswordPage_url
}

function getRedirectErrorPageUrl(error, lang) {
	const title = I18n.t(error.info.title, { locale: lang })
	const message = I18n.t(error.info.message, { locale: lang })
	const redirectErrorPage_url = `${config.app.prefix}${config.app.resetPasswordErrorPage}?title=${title}&message=${message}`
	console.log(`[api] auth.redirect: redirecting to "${redirectErrorPage_url}"`)
	return redirectErrorPage_url
}

// eslint disabled for 'next' params - it has to be defined even if not used
// eslint-disable-next-line no-unused-vars
const redirect = async (req, res, next) => {
	const duration_start = process.hrtime()

	const id = req.query.id

	if (id && mongoose.Types.ObjectId.isValid(id)) {
		try {
			// search for the pending reset id
			const reset = await Reset.findById({ _id: mongoose.Types.ObjectId(id) })
			if (!reset) {
				console.error(`[api] auth.redirect: ${Errors.RESET_EXPIRED.status}`)
				metricApiError("auth.redirect", Errors.RESET_EXPIRED, duration_start)
				res.redirect(getRedirectErrorPageUrl(Errors.RESET_EXPIRED, getLanguage(req.headers.language)))
			}
			else {
				// retrieve user that made the reset request
				const user = await User.findById({ _id: reset.user })
				if (!user) {
					console.error(`[api] auth.redirect: ${Errors.USER_NOT_FOUND.status}`)
					metricApiError("auth.redirect", Errors.USER_NOT_FOUND, duration_start)
					res.redirect(getRedirectErrorPageUrl(Errors.RESET_EXPIRED, getLanguage(req.headers.language)))
				}
				else {
					metricApiSuccess("auth.redirect", "", duration_start)
					res.redirect(getResetPasswordPageUrl(user.email))
				}
			}
		}
		catch (error) {
			console.error(`[api] auth.redirect: ${error}`)
			metricApiError("auth.redirect", error, duration_start)
			res.redirect(getRedirectErrorPageUrl(Errors.RESET_EXPIRED, getLanguage(req.headers.language)))
		}
	}
	else {
		console.error(`[api] auth.redirect: ${Errors.PARAMS_ERROR.status}`)
		metricApiError("auth.redirect", Errors.PARAMS_ERROR, duration_start)
		res.redirect(getRedirectErrorPageUrl(Errors.RESET_EXPIRED, getLanguage(req.headers.language)))
	}
}

export default redirect

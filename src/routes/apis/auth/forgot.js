import config from "config"
import Validator from "validator"
import { Reset, User } from "../../../database"
import { metricApiError, metricApiSuccess } from "../../../metrics"
import { Errors, Response, sendEmail } from "../../../utils"

// eslint disabled for 'next' params - it has to be defined even if not used
// eslint-disable-next-line no-unused-vars
const forgot = async (req, res, next) => {
	const duration_start = process.hrtime()

	const { email = "" } = req.body
	if (email && Validator.isEmail(email))
	{
		try
		{
			const user = await User.findOne({ email })

			if (user && user.$isValid()) {
				let reset = await Reset.findOne({ user: user._id })

				if (reset && reset.$isValid()) {
					await reset.remove()
				}

				reset = await Reset.create({ user: user._id })

				let link = `${config.server.url}/fantasta/auth/redirect?id=${reset._id}`
				let _from = `Fantasta Team <${config.email.email}>`
				let subject = "Cambio password"
				let _html = `<!DOCTYPE html>
                    <html>
                        <head>
                            <title>Recupero password</title>
                        </head>
                        <body>
                            <div>
                                <img src="https://i.ibb.co/6wDqGMT/logo.png" alt="logo" width="160" />
                                <p>Ciao ${user.username}</p>
                                <p>Ecco il link per cambiare la password del tuo account: <a href="${link}" data-applink="${link}">link</a></p>
                                <p>Il link sarà valido per 24 ore dopo di che dovrai provvedere a crearne uno nuovo per recuperare la tua password.</p>
                                <p>Grazie</p>
                                <p>Fantasta Team.</p>
                            </div>
                        </body>
                    </html>`

				await sendEmail(_from, user.email, null, subject, null, _html)

				metricApiSuccess("auth.forgot", "", duration_start)
			}
			else {
				console.error(`[api] auth.forgot: ${Errors.USER_NOT_FOUND.status}`)
				metricApiError("auth.forgot", Errors.USER_NOT_FOUND, duration_start)
			}
			res.json(Response.resolve())
		}
		catch (error) {
			console.error(`[api] auth.forgot: ${error}`)
			metricApiError("auth.forgot", error, duration_start)

			res.status(400).send(Response.reject(Errors.EMAIL_ERROR, req.headers.language))
		}
	}
	else {
		console.error(`[api] auth.forgot: ${Errors.EMAIL_ERROR.status}`)
		metricApiError("auth.forgot", Errors.EMAIL_ERROR, duration_start)
		res.status(400).send(Response.reject(Errors.EMAIL_ERROR, req.headers.language))
	}
}

export default forgot

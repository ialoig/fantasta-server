import Validator from 'validator'
import config from 'config'
import { Reset, User } from '../../../database'
import { metricApiError, metricApiSuccess } from '../../../metrics'
import { Errors, Response } from '../../../utils'
import { sendEmail } from '../../../utils'

const forgot = async (req, res, next) => {
    const duration_start = process.hrtime()

    const { email = '' } = req.body
    if (email && Validator.isEmail(email)) {
        try {
            let user = await User.findOne({ email })

            if (user && user.$isValid()) {
                let reset = await Reset.findOne({ user: user._id })

                if (reset && reset.$isValid()) {
                    await reset.remove()
                }

                reset = await Reset.create({ user: user._id })

                // TODO: 'localhost' non funziona dalla app.
                // Bisogna usare lo stesso indirizzo IP della variabile 'fantasta_server_url' in Fantasta_mobile/custom_config
                let link = `${config.server.url}/fantasta/auth/redirect?id=${reset._id}`
                let subject = 'Cambio password'
                let _html = `<!DOCTYPE html>
                    <html>
                        <head>
                            <title>Recupero password</title>
                        </head>
                        <body>
                            <div>
                                <img src="${config.server.url}/fantasta/images/logo.png" alt="" width="160" />
                                <p>Ciao ${user.username}</p>
                                <p>
                                    Ecco il link per cambiare la password del tuo account: <a href="${link}" data-applink="${link}">link</a>
                                </p>
                                <p>Il link sarà valido per 24 ore dopo di che dovrai provvedere a crearne uno nuovo per recuperare la tua password.</p>
                                <p>Grazie</p>
                                <p>Fantasta Team.</p>
                            </div>
                        </body>
                    </html>`

                sendEmail(email, subject, null, _html)

                metricApiSuccess("auth.forgot", '', duration_start)
            }
            else {
                console.error(`[api] auth.forgot: ${Errors.EMAIL_NOT_FOUND.status}`)
                metricApiError("auth.forgot", Errors.EMAIL_NOT_FOUND, duration_start)
            }
        }
        catch (error) {
            console.error(`[api] auth.forgot: ${error}`)
            metricApiError("auth.forgot", error, duration_start)
            res.status(400).send(Response.reject(error, req.headers.language))
        }
        res.json(Response.resolve())
    }
    else {
        console.error(`[api] auth.forgot: ${Errors.EMAIL_ERROR.status}`)
        metricApiError("auth.forgot", Errors.EMAIL_ERROR, duration_start)
        res.status(400).send(Response.reject(Errors.EMAIL_ERROR, req.headers.language))
    }
}

export default forgot

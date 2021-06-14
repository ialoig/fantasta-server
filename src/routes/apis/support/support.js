import Validator from 'validator'
import config from 'config'

import { metricApiError, metricApiSuccess } from '../../../metrics'
import { Errors, Response, sendEmail, userUtils } from '../../../utils'

const support = async (req, res, next) => {
    const duration_start = process.hrtime()

    const { text = '', email='', subject='Support' } = req.body
    if ( text )
    {
        try {
            const auth = await userUtils.userFromToken(req)
            const user = auth.user

            let _from = `Support Fantasta <${config.email.email}>`

            let _to = email && email.split && email.split(',').map( item => item.trim && item.trim() ).filter( item => Validator.isEmail(item) ) || []
            _to.unshift( `${user.username} <${user.email}>` )

            let _html = `<!DOCTYPE html>
                <html>
                    <head>
                        <title>Support request</title>
                        <style>
                            textarea { resize: none; }
                        </style>
                    </head>
                    <body>
                        <div>
                            <img src="https://i.ibb.co/6wDqGMT/logo.png" alt="" width="160" />
                            <p>Ciao ${user.username}</p>
                            <p>La tua email è stata inviata al nostro support</p>
                            <p>Riceverai al più presto una risposta.</p>
                            <p>Grazie per la tua segnalazione</p>
                            <p>Fantasta Team.</p>
                            <p>&nbsp;</p>
                            <p>Testo segnalazione:</p>
                            <p><textarea rows="4" cols="50" readonly disabled>${text}</textarea></p>
                        </div>
                    </body>
                </html>`
            
            await sendEmail( _from, _to, config.email.email, subject, null, _html)

            metricApiSuccess("support", '', duration_start)

            res.json(Response.resolve())
        }
        catch (error) {
            console.error(`[api] support: ${error}`)
            metricApiError("support", error, duration_start)
            res.status(400).send(Response.reject(error, req.headers.language))
        }
    }
    else {
        console.error(`[api] support: ${Errors.PARAMS_ERROR.status}`)
        metricApiError("support", Errors.PARAMS_ERROR, duration_start)
        res.status(400).send(Response.reject(Errors.PARAMS_ERROR, req.headers.language))
    }
}

export default support

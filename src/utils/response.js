import I18n from 'i18n-js'
import { getLanguage } from '../languages'
import { Errors } from '../utils'

const resolve = (data) => {
    return data || {}
}

const reject = (error, locale) => {
    let lang = getLanguage(locale)

    // TODO: remove logs
    console.log(`error (BEFORE): ${error}`)
    console.log(`error obj (BEFORE): ${JSON.stringify(error, null, 2)}`)

    // Translate custom error
    error = error.status && Errors[error.status] || Errors.INT_SERV_ERR
    error.info.title = I18n.t(error.info.title, { locale: lang })
    error.info.message = I18n.t(error.info.message, { locale: lang })

    // TODO: remove logs
    console.log(`error (AFTER): ${error}`)
    console.log(`error obj (AFTER): ${JSON.stringify(error, null, 2)}`)

    return error
}

const Response = {
    resolve,
    reject
}

export { Response }

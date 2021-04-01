import I18n from 'i18n-js'
import { getLanguage } from '../languages'
import { Errors } from '../utils'

const resolve = (data) => {
    return data || {}
}

const reject = (error, locale) => {
    let lang = getLanguage(locale)

    // Translate to custom error
    error = error.status && Errors[error.status] || Errors.INT_SERV_ERR
    error.info.title = I18n.t(error.info.title, { locale: lang })
    error.info.message = I18n.t(error.info.message, { locale: lang })

    return error
}

const Response = {
    resolve,
    reject
}

export { Response }

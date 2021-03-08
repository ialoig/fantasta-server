
import I18n from 'i18n-js'
import { langs } from './translations/index.js'

const defaultLang = 'it'
const availableLangs = [ 'it', 'en' ]

I18n.fallbacks = true
I18n.defaultLocale = defaultLang
I18n.locale = defaultLang

I18n.translations = langs

I18n.missingTranslation = (key) => {
    return key
}

export const getLanguage = ( language ) =>
{
    let langs = []

    if ( language && language.includes('_') )
    {
        langs = language.split('_')
    }
    else if ( language && language.includes('-') )
    {
        langs = language.split('-')
    }

    let lang = ''
    if ( langs.length )
    {
        lang = langs[0].toLowerCase()
    }
    
    return availableLangs.includes(lang) ? lang : 'it'
}

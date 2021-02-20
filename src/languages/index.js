
import I18n from 'i18n-js'

import { langs } from './translations'

const defaultLang = 'it'

I18n.fallbacks = true
I18n.defaultLocale = defaultLang
I18n.locale = defaultLang

I18n.translations = langs

export const getLanguage = ( lang ) =>
{
    let langs = []

    if ( lang && lang.includes('_') )
    {
        langs = lang.split('_')
    }
    else if ( lang && lang.includes('-') )
    {
        langs = lang.split('-')
    }

    if ( lang.length==2 )
    {
        return lang[0].toLowerCase()
    }
    else
    {
        return 'it'
    }

}


import I18n from 'i18n-js'

import { langs } from './translations'

const defaultLang = 'it'

I18n.fallbacks = true
I18n.defaultLocale = defaultLang
I18n.locale = defaultLang

I18n.translations = langs



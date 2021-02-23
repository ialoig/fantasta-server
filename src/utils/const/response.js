
import I18n from 'i18n-js'

import { getLanguage } from '../../languages'

const resolve = ( status, data, token ) =>
{
    return {
        'ok': true,
        'code': HttpStatus[status].code,
        'status': HttpStatus[status].status,
        'data': data || {}
    }
}

const reject = ( status, info, error, locale ) =>
{
    let lang = getLanguage(locale)

    return {
        'error': true,
        'code': HttpStatus[status].code,
        'status': HttpStatus[status].status,
        'info': {
            title: I18n.t( ErrorMessages[info].title, {locale: lang} ),
            message: I18n.t( ErrorMessages[info].message, {locale: lang} )
        },
        'data': error || {}
    }
}

const ErrorMessages = {
    'BAD_REQUEST': {
        title: 'bad_request',
        message: 'request_error'
    },
    'PARAMS_ERROR': {
        title: 'parasms_error',
        message: 'params_not_correct'
    },
    'NOT_FOUND': {
        title: 'not_found',
        message: 'item_not_found'
    },
    'USER_NOT_FOUND': {
        title: 'user_not_found',
        message: 'try_change_email'
    },
    'USER_PRESENT': {
        title: 'user_present',
        message: 'try_other_email'
    },
    'LEAGUE_NOT_FOUND' : {
        title: 'league_not_found',
        message: 'try_change_leaguename'
    },
    'LEAGUE_PRESENT': {
        title: 'league_present',
        message: 'try_change_leaguename'
    },
    'INT_SERV_ERR': {
        title: 'server_error',
        message: 'something_went_wrong'
    },
    'WRONG_PASSWORD': {
        title: 'wrong_password',
        message: 'try_change_password'
    },
    'WRONG_USER': {
        title: 'wrong_user',
        message: 'try_change_user'
    },
    'FULL_LEAGUE': {
        title: 'league_full',
        message: 'cannot_join_league'
    },
    'LEAGUE_NAME_EMPTY' : {
        title: 'league_name_empty',
        message: 'leaguename_need_value'
    },
    'USERNAME_EMPTY': {
        title: 'username_empty',
        message: 'username_need_value'
    },
    'LEAGUE_NAME_SHORTS': {
        title: 'league_name_short',
        message: 'league_min_length_6'
    },
    'LEAGUE_PASSWORD_EMPTY': {
        title: 'league_password_empty',
        message: 'password_need_value'
    },
    'LEAGUE_PASSWORD_SHORT': {
        title: 'league_password_short',
        message: 'passowrd_min_length_6'
    },
    'LEAGUE_ATTENDEES_NOT_CORRECT': {
        title: 'league_attendees_not_correct',
        message: 'min_attendees_2'
    },
    'PLAYERS_NUMBER_ERROR': {
        title: 'players_number_not_correct',
        message: 'modify_number_players_and_retry'
    },
    '11000' : {
        title: 'item_used',
        message: 'chooseOtherName'
    }
}

const HttpStatus =
{
    'OK': {
        code: 200,
        status: 'OK'
    },
    'BAD_REQUEST': {
        code: 400,
        status: 'Bad Request'
    },
    'UNAUTHORIZED': {
        code: 401,
        status: 'Unauthorized'
    },
    'FORBIDDEN': {
        code: 403,
        status: 'Forbidden'
    },
    'NOT_FOUND': {
        code: 404,
        status: 'Not Found'
    },
    'METHOD_NOT_ALLOWED': {
        code: 405,
        status: 'Method Not Allowed'
    },
    'NOT_ACCEPTABLE': {
        code: 406,
        status: 'Not Acceptable'
    },
    'INT_SERV_ERR': {
        code: 500,
        status: 'Internal Server Error'
    },
    'SERVICE_UNAVAILABLE': {
        code: 503,
        status: 'Service Unavailable'
    },
    'BAND_LIMIT_EXCEEDED': {
        code: 509,
        status: 'Bandwidth Limit Exceeded'
    },
    'WRONG_PASSWORD': {
        code: 600,
        status: 'Password Not Valid'
    },
    'WRONG_USER': {
        code: 601,
        status: 'User Not Valid'
    },
    'FULL_LEAGUE': {
        code: 602,
        status: 'Full league'
    },
    '11000' : {
        code: 11000,
        status: 'mongoDB insertDocument error: caused by duplicate key error index'
    }
}

const Response = {
    resolve,
    reject
}

export { Response }

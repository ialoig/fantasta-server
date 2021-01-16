
const resolve = ( status, data, token ) =>
{
    return {
        'ok': true,
        'code': HttpStatus[status].code,
        'status': HttpStatus[status].status,
        'data': data || {}
    }
}

const reject = ( status, info, error ) =>
{
    return {
        'ok': false,
        'code': HttpStatus[status].code,
        'status': HttpStatus[status].status,
        'info': {
            title: ErrorMessages[info] ? ErrorMessages[info].title : '',
            subTitle: ErrorMessages[info] ? ErrorMessages[info].subTitle : ''
        },
        'data': error || {}
    }
}

const ErrorMessages = {
    'BAD_REQUEST': {
        title: 'bad_request',
        subTitle: 'params_not_correct'
    },
    'NOT_FOUND': {
        title: 'not_found',
        subTitle: 'item_not_found'
    },
    'USER_NOT_FOUND': {
        title: 'user_not_found',
        subTitle: 'try_change_username'
    },
    'USER_PRESENT': {
        title: 'user_present',
        subTitle: 'try_change_username'
    },
    'LEAGUE_NOT_FOUND' : {
        title: 'league_not_found',
        subTitle: 'try_change_leaguename'
    },
    'LEAGUE_PRESENT': {
        title: 'league_present',
        subTitle: 'try_change_leaguename'
    },
    'INT_SERV_ERR': {
        title: 'server_error',
        subTitle: 'something_went_wrong'
    },
    'WRONG_PASSWORD': {
        title: 'wrong_password',
        subTitle: 'try_change_password'
    },
    'WRONG_USER': {
        title: 'wrong_user',
        subTitle: 'try_change_user'
    },
    'FULL_LEAGUE': {
        title: 'league_full',
        subTitle: 'cannot_join_league'
    },
    'LEAGUE_NAME_EMPTY' : {
        title: 'league_name_empty',
        subTitle: 'name_need_value'
    },
    'USERNAME_EMPTY': {
        title: 'username_empty',
        subTitle: 'username_need_value'
    },
    'LEAGUE_NAME_SHORTS': {
        title: 'league_name_short',
        subTitle: 'league_min_length_6'
    },
    'LEAGUE_PASSWORD_EMPTY': {
        title: 'league_password_empty',
        subTitle: 'password_need_value'
    },
    'LEAGUE_PASSWORD_SHORT': {
        title: 'league_password_short',
        subTitle: 'passowrd_min_length_6'
    },
    'LEAGUE_ATTENDEES_NOT_CORRECT': {
        title: 'league_attendees_not_correct',
        subTitle: 'min_attendees_2'
    },
    'PARAMS_MISSING': {
        title: 'params_missing',
        subTitle: 'fill_fields_and_retry'
    },
    'CUSTOM_STARTINGPRICE_ERROR': {
        title: 'custom_startingPrice_not_correct',
        subTitle: 'fill_starting_price'
    },
    'PLAYERS_NUMBER_ERROR': {
        title: 'players_number_not_correct',
        subTitle: 'modify_number_players_and_retry'
    },
    '11000' : {
        title: 'item_used',
        subTitle: 'chooseOtherName'
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
        code: 601,
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

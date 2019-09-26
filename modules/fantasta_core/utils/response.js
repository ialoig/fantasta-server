
import { ErrorMessages, HttpStatus } from 'utils'

const resolve = ( status, data, token ) =>
{
    return {
        'ok': true,
        'code': HttpStatus[status].code,
        'status': HttpStatus[status].status,
        'data': data || {},
        'token': token || null
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

export default {
    resolve,
    reject
}

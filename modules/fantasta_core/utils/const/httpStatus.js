
const httpStatus =
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
};

module.exports = httpStatus;


var httpStatus = require('./const/httpStatus');
var errorMessages = require('./const/errorMessages');

var resolve = function ( status, data, token )
{
    var ret = {
        'ok': true,
        'code': httpStatus[status].code,
        'status': httpStatus[status].status,
        'data': data || {},
        'token': token || null
    };
    return ret;
}

var reject = function ( status, info, error )
{
    var ret = {
        'ok': false,
        'status': httpStatus[status].status,
        'code': httpStatus[status].code,
        'info': {
            title: errorMessages[info] ? errorMessages[info].title : '',
            subTitle: errorMessages[info] ? errorMessages[info].subTitle : ''
        },
        'data': error || {}
    };
    return ret;
}

module.exports =  {
    resolve,
    reject
};

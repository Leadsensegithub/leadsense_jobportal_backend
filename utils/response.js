

module.exports.getResponse = (statusCode = '', result = {}, msg = '') => {
    let response = {};
    try {
        if (result && ((Object.keys(result).length > 0 && result.error) || (Object.keys(result).length === 0))) {
            response.status = (statusCode) ? statusCode : 403;
            response.error = true;
            response.msg = (msg) ? msg : 'OOPS';
        } else {
            response.status = (statusCode) ? statusCode : 200;
            response.error = false
            response.msg = (msg) ? msg : 'SUCCESS';
            response.data = result.data;
        }
        return response;

    } catch (err) {
        response.error = true
        response.msg = 'OOPS'
        return response;

    }
}
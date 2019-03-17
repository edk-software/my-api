const logger = require('../../config/logger');

module.exports = {
    sendHttpResponse: function(result, res, errMessage, controllerMethodName) {
        if (result && result.length > 0) {
           var jsonResult = JSON.stringify(result);
            res.contentType('application/json');
            res.end(jsonResult);
        } else {
            res.send(errMessage)
        }
    }
}
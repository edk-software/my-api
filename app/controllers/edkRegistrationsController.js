var edkRegistrationDao = require('../dao/edkRegistrationDao');
var httpResponse = require('../util/httpUtil');

exports.getRegistrations = function(req, res) {
    edkRegistrationDao.getEdkRegistrations(req.params.id, function (result) {
        httpResponse.sendHttpResponse(result, res, "User not found","getRegistrations");
    });
};
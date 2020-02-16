var edkGeneralInfoDao = require('../dao/edkGeneralInfoDao.js');
var httpResponse = require('../util/httpUtil');
var constants = require('../../config/constants');

exports.getGeneralInfoVerification = function (req, res) {
    edkGeneralInfoDao.getGeneralInfoVerification(function (result) {
        httpResponse.sendHttpResponse(result, res, "There are no data", "getGeneralInfoVerification");
    });
}
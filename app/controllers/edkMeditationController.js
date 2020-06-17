var edkMeditationDao = require('../dao/edkMeditationDao.js');
var httpResponse = require('../util/httpUtil');


exports.getEdkMedidationList = function (req, res) {
    edkMeditationDao.getMeditationList(function (result) {
        httpResponse.sendHttpResponse(result, res, "There are no data", "getEdkMedidationList");
    });
}
exports.getEdkMeditationById = function (req, res) {
    edkMeditationDao.getMeditationById(req.query.meditationId, function (result) {
        httpResponse.sendHttpResponse(result, res, "There are no data", "getEdkMeditationById");
    });
}
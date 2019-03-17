var httpResponse = require('../util/httpUtil');
var edkRegistrationSettingsDao = require('../dao/edkRegistrationSettingsDao');

exports.getRegistrationSettings = function(req, res) {
    edkRegistrationSettingsDao.getEdkRegistrationSettings(req.query.routeId, function (result) {
        httpResponse.sendHttpResponse(result, res, "Registration not found","getRegistrationSettings");
    });
};
exports.getParticipantAmount = function(req, res) {
    edkRegistrationSettingsDao.getEdkParticipantAmount(req.query.editionId, function (result) {
        httpResponse.sendHttpResponse(result, res, "No participant at edition","getParticipantAmount");
    });
};



var edkLanguageDao = require('../dao/edkLanguageDao');
var httpResponse = require('../util/httpUtil');

exports.getLanguage = function(req, res) {
    edkLanguageDao.getEdkLanguage(req.query.projectId, function (result) {
        httpResponse.sendHttpResponse(result, res, "No language is assign to project","getLanguage");
    });


};
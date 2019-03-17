var edkReflectionsDao = require('../dao/edkReflectionsDao');
var httpResponse = require('../util/httpUtil');

exports.getReflections = function(req, res) {
    edkReflectionsDao.getEdkReflections(req.query.id, req.query.projectId, function (result) {
        httpResponse.sendHttpResponse(result, res, "Reflections not found","getReflections");
    });
};

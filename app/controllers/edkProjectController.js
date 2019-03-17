var edkProjectDao = require('../dao/edkProjectDao');
var httpResponse = require('../util/httpUtil');

exports.getProjects = function(req, res) {
    edkProjectDao.getEdkProjects(req.query.id, function (result) {
        httpResponse.sendHttpResponse(result, res, "Projects not found","getProjects");
    });
};
var edkSearchDao = require('../dao/edkSearchDao');
var httpResponse = require('../util/httpUtil');

exports.getSearch= async function(req, res) {
    await edkSearchDao.getEdkSearch(req.query.search, function (result) {
        httpResponse.sendHttpResponse(result, res, "No result for searched text " + req.query.search + " not found","getSearch");
    });
};


var edkCountryDao = require('../dao/edkCountryDao');
var httpResponse = require('../util/httpUtil');

exports.getCountryAmount = function(req, res) {
    edkCountryDao.getEdkCountryAmount( req.query.editionId, function (result) {
        httpResponse.sendHttpResponse(result,res,"No country found","getTerritoryList");
    });
};

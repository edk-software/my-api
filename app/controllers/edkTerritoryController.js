var edkTerritoryDao = require('../dao/edkTerritoryDao');
var httpResponse = require('../util/httpUtil');

exports.getTerritoryList = function(req, res) {
    edkTerritoryDao.getEdkTerritoryList(req.query.sortByColumn, req.query.order, req.query.editionId, function (result) {
        httpResponse.sendHttpResponse(result,res,"Territories not found","getTerritoryList");
    });
};

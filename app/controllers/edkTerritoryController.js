var edkTerritoryDao = require('../dao/edkTerritoryDao');
var httpResponse = require('../util/httpUtil');

exports.getTerritoryList = function(req, res) {
    edkTerritoryDao.getEdkTerritoryList(req.query.editionId, req.query.eventDate,
        req.query.orderByTerritoryId, req.query.orderByTerritoryName, function (result) {
        httpResponse.sendHttpResponse(result,res,"Territories not found","getTerritoryList");
    });
};

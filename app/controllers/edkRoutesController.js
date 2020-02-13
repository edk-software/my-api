var edkRoutesDao = require('../dao/edkRoutesDao');
var httpResponse = require('../util/httpUtil');
var parser = require('../util/parser');


exports.getRoutes = function (req, res) {
    edkRoutesDao.getEdkRoute(req.query.id, req.query.editionId, function (result) {
        parser.parseNotes(result);
        httpResponse.sendHttpResponse(result, res, "Routes not found", "getRoutes");
    });
};

exports.getRoutesByArea = function (req, res) {
    edkRoutesDao.getEdkRoutesByArea(req.query.areaId, req.query.excludedRouteId, function (result) {
        httpResponse.sendHttpResponse(result, res, "Area does not contain any routes", "getRoutesByArea");
    });
};

exports.getRouteList = function (req, res) {
    edkRoutesDao.getEdkRouteList(req.query.territoryId, req.query.editionId, req.query.areaId, req.query.eventDate,
        req.query.orderByTerritoryName, req.query.orderByRouteName, req.query.orderByRouteLength,
        req.query.orderByEventDate,
        function (result) {
            httpResponse.sendHttpResponse(result, res, "Routes  not found", "getRouteList");
        });
};


exports.getRoutesByTeritory = function (req, res) {
    edkRoutesDao.getEdkRoutesByTerritory(req.query.territoryId, req.query.excludedRouteId, function (result) {
        httpResponse.sendHttpResponse(result, res, "Territory does not contain routes", "getRoutesByTeritory");
    });
};
exports.getRouteAmount = function (req, res) {
    edkRoutesDao.getEdkRouteAmount(req.query.editionId, function (result) {
        httpResponse.sendHttpResponse(result, res, "No routes", "getRouteAmount");
    });
};

exports.getRouteDetail = function (req, res) {
    edkRoutesDao.getEdkRouteDetail(req.query.id, function (result) {
        httpResponse.sendHttpResponse(result, res, "Route not found", "getRouteDetail");
    });
};
var edkRoutesDao = require('../dao/edkRoutesDao');
var httpResponse = require('../util/httpUtil');
var parser = require('../util/parser');


exports.getRoutes = function (req, res) {
    edkRoutesDao.getEdkRoute(req.query.id, req.query.editionId, function (result) {
        parser.parseNotes(result);
        httpResponse.sendHttpResponse(result, res, "Routes not found", "getRoutes");
    });
};

exports.getRouteList = function (req, res) {
    edkRoutesDao.getEdkRouteList(req.query.territoryId, req.query.editionId, req.query.areaId, req.query.eventDate,
        req.query.orderByTerritoryName, req.query.orderByRouteName, req.query.orderByRouteLength,
        req.query.orderByEventDate, req.query.searchByRouteName,
        function (result) {
            httpResponse.sendHttpResponse(result, res, "Routes  not found", "getRouteList");
        });
};

exports.getRouteListForMobile = function (req, res) {
    edkRoutesDao.getEdkRouteListForMobile(function (result) {
            httpResponse.sendHttpResponse(result, res, "Routes  not found", "getRouteListForMobile");
        });
};

exports.getRouteDetail = function (req, res) {
    edkRoutesDao.getEdkRouteDetail(req.query.id, function (result) {
        httpResponse.sendHttpResponse(result, res, "Route not found", "getRouteDetail");
    });
};

exports.getRoutePoints = function (req, res) {
    edkRoutesDao.getEdkRoutePoints(req.query.id, function (result) {
        httpResponse.sendHttpResponse(result, res, "Route not found", "getRouteDetail");
    });
};

exports.getRoutesByUserId = function (req, res) {
    edkRoutesDao.getEdkRoutesByUserId( req.query.userId, function (result) {
            httpResponse.sendHttpResponse(result, res, "Routes  not found", "getRouteList");
        });
};

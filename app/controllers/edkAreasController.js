var edkAreasDao = require('../dao/edkAreasDao');
var httpResponse = require('../util/httpUtil');
var parser = require('../util/parser');

exports.getAreas = function (req, res) {

    edkAreasDao.getEdkAreas(req.query.territoryId, req.query.editionId, req.query.eventDate, req.query.orderByAreaName, req.query.orderByTerritoryName, req.query.orderByEventDate, req.query.searchAreaName, function (result) {
            parser.parseNotes(result);
            httpResponse.sendHttpResponse(result, res, "Areas not found", "getAreas");
        });
};

exports.getAreasDetail = function (req, res) {
    edkAreasDao.getEdkAreasDetail(req.query.id, function (result) {
        httpResponse.sendHttpResponse(result, res, "Areas not found", "getAreasDetail");
    });
};

exports.getEdkAreaRoutesList = function (req, res) {
    edkAreasDao.getEdkAreaRoutesList(
        req.query.territoryId, req.query.editionId,
        req.query.areaId, req.query.eventDate,
        req.query.orderByAreaName, req.query.orderByTerritoryName,
        req.query.orderByRouteName, req.query.orderByRouteLength,
        req.query.orderByEventDate, function (result) {
            httpResponse.sendHttpResponse(result, res, "Areas not found", "getAreaList");
        });
};

exports.getAreasByTerritory = function (req, res) {
    edkAreasDao.getEdkAreasByTerritory(req.query.territoryId, function (result) {
        httpResponse.sendHttpResponse(result, res, "Area does not contain any routes", "getAreasByTerritory");
    });
};

exports.getAreaAmount = function (req, res) {
    edkAreasDao.getEdkAreaAmount(req.query.editionId, function (result) {
        httpResponse.sendHttpResponse(result, res, "Area does not contain any routes", "getAreaAmount");
    });
};

exports.getNewAreaDetail = function (req, res) {
    edkAreasDao.getNewAreaDetail(req.query.id, function (result) {
        httpResponse.sendHttpResponse(result, res, "Area not found", "getNewAreaDetail");
    });
};
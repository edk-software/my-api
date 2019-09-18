var edkAreasDao = require('../dao/edkAreasDao');
var httpResponse = require('../util/httpUtil');
var parser = require('../util/parser');

exports.getAreas = function(req, res) {
    edkAreasDao.getEdkAreas(req.query.id, req.query.editionId, function (result) {
        parser.parseNotes(result);
        httpResponse.sendHttpResponse(result, res, "Areas not found","getAreas");
    });
};

exports.getAreasDetail = function(req, res) {
    edkAreasDao.getEdkAreasDetail(req.query.id, function (result) {
        httpResponse.sendHttpResponse(result, res, "Areas not found","getAreasDetail");
    });
};

exports.getAreaList = function(req, res) {
    edkAreasDao.getEdkAreaList(
        req.query.territoryId, req.query.editionId,
        req.query.areaId, req.query.eventDate,
        req.query.orderByAreaName, req.query.orderByTerritoryName,
        req.query.orderByRouteName, req.query.orderByRouteLength,
        req.query.orderByEventDate, function (result) {
        httpResponse.sendHttpResponse(result, res, "Areas not found","getAreaList");
    });
};

exports.getAreasByTerritory = function(req, res) {
    edkAreasDao.getEdkAreasByTerritory(req.query.territoryId,  function (result) {
        httpResponse.sendHttpResponse(result, res, "Area does not contain any routes","getAreasByTerritory");
    });
};
exports.getAreaAmount = function(req, res) {
    edkAreasDao.getEdkAreaAmount(req.query.editionId,  function (result) {
        httpResponse.sendHttpResponse(result, res, "Area does not contain any routes","getAreaAmount");
    });
};


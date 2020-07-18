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

exports.getAreaDetail = function (req, res) {
    edkAreasDao.getAreaDetail(req.query.id, function (result) {
        httpResponse.sendHttpResponse(result, res, "Area not found", "getAreaDetail");
    });
};


exports.getEdkDates = function (req, res) {
    edkAreasDao.getEdkDates(req.query.projectId, function (result) {
        httpResponse.sendHttpResponse(result, res, "No edk dates found", "getEdkDates");
    });
};
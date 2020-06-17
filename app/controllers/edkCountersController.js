var edkCountersDao = require('../dao/edkCountersDao.js');
var httpResponse = require('../util/httpUtil');
var constants = require('../../config/constants');

exports.getUsersRegistrationCount = function (req, res) {
    edkCountersDao.getEdkUsersRegistrationCount(req.query.editionId, function (result, err) {
        if(err) {
            httpResponse.sendHttpResponse(err, res, "There are no registered user", "getEdkUserRegistrationCount");
        } else {
            httpResponse.sendHttpResponse(result, res, "There are no registered user", "getEdkUserRegistrationCount");
        }
    });
};

exports.getRoutesCount = function (req, res) {
    edkCountersDao.getEdkRoutesCount(req.query.editionId, function (result, err) {
        if(err) {
            httpResponse.sendHttpResponse(err, res, "Routes count not found", "getEdkRoutesCount");
        } else {
            httpResponse.sendHttpResponse(result, res, "Routes count not found", "getEdkRoutesCount");
        }

    });
};

exports.getAreasCount = function (req, res) {
    edkCountersDao.getEdkAreasCount(req.query.editionId, function (result, err) {
        if(err) {
            httpResponse.sendHttpResponse(err, res, "Areas count not found", "getEdkAreasCount");
        } else {
            httpResponse.sendHttpResponse(result, res, "Areas count not found", "getEdkAreasCount");
        }
    });
};

exports.getTerritoriesCount = function (req, res) {
    edkCountersDao.getEdkTerritoriesCount(req.query.editionId, function (result, err) {
        if(err) {
            httpResponse.sendHttpResponse(err, res, "Territories count not found", "getEdkTerritoriesCount");
        } else {
            httpResponse.sendHttpResponse(result, res, "Territories count not found", "getEdkTerritoriesCount");
        }

    });
};

exports.getCountryCount = function (req, res) {
    httpResponse.sendHttpResponse(edkCountersDao.getEdkCountryCount(), res, null, "getCountryCount")
};
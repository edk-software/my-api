var edkCountersDao = require('../dao/edkCountersDao.js');
var httpResponse = require('../util/httpUtil');
var constants = require('../../config/constants');

exports.getUsersRegistrationCount = function (req, res) {
    edkCountersDao.getEdkUsersRegistrationCount(function (result) {
        httpResponse.sendHttpResponse(result, res, "There are no registered user", "getEdkUserRegistrationCount");
    });
};

exports.getRoutesCount = function (req, res) {
    edkCountersDao.getEdkRoutesCount(function (result) {
        httpResponse.sendHttpResponse(result, res, "Routes count not found", "getEdkRoutesCount");
    });
};

exports.getAreasCount = function (req, res) {
    edkCountersDao.getEdkAreasCount(function (result) {
        httpResponse.sendHttpResponse(result, res, "Areas count not found", "getEdkAreasCount");
    });
};

exports.getTerritoriesCount = function (req, res) {
    edkCountersDao.getEdkTerritoriesCount(function (result) {
        httpResponse.sendHttpResponse(result, res, "Territories count not found", "getEdkTerritoriesCount");
    });
};

exports.getCountryCount = function (req, res) {
    httpResponse.sendHttpResponse(constants.countryCount, res, null, "getCountryCount")
};
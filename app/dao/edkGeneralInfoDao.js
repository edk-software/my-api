const connection = require('../../config/dbConnection');
const logger = require('../../config/logger');
const edkCountersDao = require('./edkCountersDao');
const edkMeditationDao = require('./edkMeditationDao');
const edkRoutesDao = require('./edkRoutesDao');
const constants = require('../../config/constants');

function getRoutesGroupByAreaGroupByTerritory(editionId, callback) {
    var sqlQuery = "SELECT " +
        "ca.id as areaId, " +
        "ca.name as areaName, " +
        "ca.lat as latitude, c" +
        "a.lng as longitude," +
        " ca.eventDate as eventDate," +
        " ca.territoryId ," +
        " ct.name as territoryName, " +
        " cer.id as routeId, " +
        " cer.name as routeName, " +
        " cer.routeLength," +
        " cer.routeFrom," +
        " cer.routeTo," +
        " cer.updatedAt," +
        " cer.routeAscent, " +
        " cer.routeCourse, " +
        " cer.publicAccessSlug " +
        "FROM cantiga_areas ca " +
        "join cantiga_territories ct " +
        "on (ca.territoryId = ct.id) " +
        "join cantiga_area_statuses cas " +
        "on(ca.statusId = cas.id) " +
        "join cantiga_projects cp " +
        "on(cp.id = ca.projectId) " +
        "join cantiga_edk_routes cer " +
        "on(cer.areaId = ca.id) " +
        "where cas.isPublish = 1 " +
        "and cer.approved = 1 ";

    let conditions = [];
    let values = [];

    conditions.push(" and cp.editionId=?");
    if (editionId) {
        values.push(editionId);
    } else {
        values.push(constants.defaultEditionId);
    }

    sqlQuery = sqlQuery + (conditions.length ?
        conditions.join(' ') : '');

    function addNewArea(row, parsedRows) {
        let routeList = [];
        routeList.push({
            "routeId": row.routeId,
            "routeName": row.routeName,
            "routeFrom": row.routeFrom,
            "routeTo": row.routeTo,
            "routeLength": row.routeLength + " km",
            "routeAscent": row.routeAscent + " m",
            "routeDescription": row.routeCourse,
            "routeLastUpdate": row.updatedAt,
            "routeKmlFile": row.routeKmlFile,
            "routeDescriptionFile": row.routeDescriptionFile
        });
        parsedRows.areas.push({
            "areaId": row.areaId,
            "areaName": row.areaName,
            "latitude": row.latitude,
            "longitude": row.longitude,
            "eventDate": row.eventDate,
            "routes": routeList
        });
    }

    function addNewTerritoryAndArea(row, parsedRows) {
        let routeList = [];
        routeList.push({
            "routeId": row.routeId,
            "routeName": row.routeName,
            "routeFrom": row.routeFrom,
            "routeTo": row.routeTo,
            "routeLength": row.routeLength + " km",
            "routeAscent": row.routeAscent + " m",
            "routeDescription": row.routeCourse,
            "routeLastUpdate": row.updatedAt,
            "routeKmlFile": row.routeKmlFile,
            "routeDescriptionFile": row.routeDescriptionFile

        });

        let areaList = []
        areaList.push({
            "areaId": row.areaId,
            "areaName": row.areaName,
            "routes": routeList
        });

        parsedRows.push({
            "groupId": row.territoryId,
            "groupName": row.territoryName,
            "areas": areaList
        });
    }
    function addFileLinks(rows) {
        rows.map(row => {
            var url = constants.mirror_url.replace("%HASH%", row.publicAccessSlug);
            row.routeKmlFile = url + constants.gps_infix + "-" + row.routeId + ".kml";
            row.routeDescriptionFile = url + constants.guide_infix + "-" + row.routeId + ".pdf";
        });
    }

    connection.query(sqlQuery,
        values, function (err, rows, field) {
            if (err) {
                logger.error("getEdkAreaList error: " + err);
                callback(err);
            } else {
                logger.info("getEdkAreaList success ");
                let parsedRows = [];
                addFileLinks(rows);
                rows.forEach(function (row) {
                    if (parsedRows.length === 0) {
                        addNewTerritoryAndArea(row, parsedRows);
                    } else {
                        let isTerritoryExist = false;
                        let isAreaExist = false;
                        parsedRows.forEach(function (parsedRow) {
                            if (parsedRow.groupId == row.territoryId) {
                                isTerritoryExist = true;
                                if (parsedRow.areas && parsedRow.areas.length > 0) {
                                    parsedRow.areas.forEach(function (area) {
                                        if (area.areaId == row.areaId) {
                                            isAreaExist = true;
                                            area.routes.push({
                                                "routeId": row.routeId,
                                                "routeName": row.routeName,
                                                "routeFrom": row.routeFrom,
                                                "routeTo": row.routeTo,
                                                "routeLength": row.routeLength + " km",
                                                "routeAscent": row.routeAscent + " m",
                                                "routeDescription": row.routeCourse,
                                                "routeLastUpdate": row.updatedAt,
                                                "routeKmlFile": row.routeKmlFile,
                                                "routeDescriptionFile": row.routeDescriptionFile
                                            });
                                        }
                                    });
                                }
                                ;
                                if (!isAreaExist) {
                                    addNewArea(row, parsedRow);
                                }

                            }
                        });
                        if (!isTerritoryExist) {
                            addNewTerritoryAndArea(row, parsedRows);
                        }
                    }
                });
                callback(parsedRows);
            }
        });
}

module.exports = {

    getGeneralInfoVerification: function (callback) {
        connection.query("SELECT max(editionId) as currentYearId FROM cantiga_projects",
            async function  (err, rows, field) {
                if (err) {
                    logger.error("getGeneralInfoVerification error: " + err);
                    callback(err);
                } else {
                    await edkCountersDao.waitForEdkAreasCount(rows[0].currentYearId, rows);
                    await edkCountersDao.waitForEdkRoutesCount(rows[0].currentYearId, rows);
                    await edkCountersDao.waitForTerritoriesCount(rows[0].currentYearId, rows);
                    await edkRoutesDao.waitForEdkRoutesLastUpdated(rows);
                    rows[0].countryCount = edkCountersDao.getEdkCountryCount();
                    await edkMeditationDao.waitForMeditationLastUpdated(rows);
                    logger.info("getGeneralInfoVerification success : " + rows);
                    callback(rows);
                }
            });
    },   getEdkAllGeneralInfo: function(editionId, callback) {
        connection.query("SELECT max(editionId) as currentYearId FROM cantiga_projects",
            async function  (err, rows, field) {
                if (err) {
                    logger.error("getEdkAllGeneralInfo error: " + err);
                    callback(err);
                } else {
                    await edkCountersDao.waitForEdkAreasCount(rows[0].currentYearId, rows);
                    await edkCountersDao.waitForEdkRoutesCount(rows[0].currentYearId, rows);
                    await edkCountersDao.waitForTerritoriesCount(rows[0].currentYearId, rows);
                    await edkRoutesDao.waitForEdkRoutesLastUpdated(rows);
                    rows[0].countryCount = edkCountersDao.getEdkCountryCount();
                    logger.info("getEdkAllGeneralInfo success : " + rows);
                    getRoutesGroupByAreaGroupByTerritory(editionId, (groupedRoutesByAreaAndTerritory) =>
                    {
                      rows[0].data = groupedRoutesByAreaAndTerritory;
                     callback(rows);
                    });

                }
            });

    },

};
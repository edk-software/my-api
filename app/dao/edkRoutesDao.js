var connection = require('../../config/dbConnection');
const logger = require('../../config/logger')
var constants = require('../../config/constants');
const sqlQueryBuilder = require('../util/sqlQueryBuilder');
var edkAreaNotesDao = require('./edkAreasNotesDao');
var edkRouteNotesDao = require('./edkRouteNotesDao');



module.exports = {

    getEdkRoute: function (id, editionId, callback) {
        var sqlQuery = "SELECT r.id as routeId, r.name as routeName, ca.id as areaId, ca.name as areaName, r.routeType, r.routePatron, r.routeColor," +
            " r.routeAuthor, r.routeFrom, r.routeFromDetails, r.routeTo, r.routeToDetails," +
            " r.routeCourse, r.routeLength, r.routeAscent, r.routeObstacles, r.createdAt, r.updatedAt," +
            " crs.startTime, crs.endTime, crs.participantLimit, crs.participantNum," +
            " if(r.mapFile is not null, concat_ws('/', (select `value` from cantiga_project_settings where `key` = 'edk_mirror_url' AND `projectId` = ca.projectId),r.publicAccessSlug, CONCAT('edk-map-route-',r.id, '.', SUBSTRING_INDEX(r.mapFile,'.',-1))) , null) as mapLink, " +
            " if(r.gpsTrackFile is not null, concat_ws('/', (select `value` from cantiga_project_settings where `key` = 'edk_mirror_url' AND `projectId` = ca.projectId),r.publicAccessSlug, CONCAT('edk-gps-route-',r.id, '.', SUBSTRING_INDEX(r.gpsTrackFile,'.',-1))), null) as gpsLink," +
            " if(r.descriptionFile is not null ,concat_ws('/', (select `value` from cantiga_project_settings where `key` = 'edk_mirror_url' AND `projectId` = ca.projectId),r.publicAccessSlug, CONCAT('edk-guide-route-',r.id, '.', SUBSTRING_INDEX(r.descriptionFile,'.',-1))), null) as DescriptionLink," +
            " GROUP_CONCAT(rn.content SEPARATOR \"$|%\") as note," +
            " (crs.participantNum + crs.externalParticipantNum) as allParticipantNumber " +
            " FROM cantiga_edk_routes r " +
            " join cantiga_areas ca " +
            " on (ca.id = r.areaId) " +
            " join cantiga_projects cp " +
            " on(cp.id = ca.projectId) " +
            " left join  cantiga_edk_route_notes rn " +
            " on(rn.routeId = r.id)" +
            " left join cantiga_edk_registration_settings crs" +
            " on(crs.routeId = r.id)" +
            " where ";

        var values = [];
        var conditions = [];
        conditions.push(" archived = 0 and r.approved=1");
        if (id) {
            conditions.push("  r.id=?");
            values.push(id);
        } else if (editionId) {
            conditions.push("  cp.editionId=?");
            values.push(editionId);
        } else {
            conditions.push(" cp.editionId=2019")
        }
        sqlQuery = sqlQuery + (conditions.length ?
            conditions.join(' and ') : '');

        sqlQuery = sqlQuery + "  group by r.id";

        connection.query(sqlQuery,
            values,
            function (err, rows, field) {
                if (err) {
                    logger.error("getEdkRoute error: " + err);
                    callback(err);
                } else {
                    logger.info("getEdkRoute success");
                    callback(rows);
                }
            });
    },
    getEdkRoutesByArea: function (areaId, excludedRouteId, callback) {
        var sqlQuery = "SELECT r.id as id, r.name, r.routeFrom as start, r.routeTo as end, " +
            " r.routeLength as length, r.routeAscent as ascent  FROM cantiga_edk_routes r" +
            " inner join cantiga_areas ca" +
            " on(r.areaId = ca.id)" +
            " where approved = 1";
        var conditions = [];
        var values = [];
        if (areaId) {
            conditions.push(" and ca.id=?");
            values.push(areaId)
        }
        if (excludedRouteId) {
            conditions.push(" and r.id <> ?");
            values.push(excludedRouteId)
        }

        sqlQuery = sqlQuery + (conditions.length ?
            conditions.join(' ') : '');
        connection.query(sqlQuery,
            values,
            function (err, rows, field) {
                if (err) {
                    logger.error("getEdkRoutesByArea error: " + err);
                    callback(null, err);
                } else {
                    logger.info("getEdkRoutesByArea success");
                    callback(rows, null);
                }
            });
    },
    getEdkRoutesByTerritory: function (territoryId, excludedRouteId, callback) {
        var sqlQuery = "SELECT r.id as routeId, ca.id as areaId, t.id as territoryId," +
            " r.name as routeName, ca.name as areaName, t.name as territoryName," +
            " r.routeFrom, r.routeTo, r.routeLength, r.routeAscent, ca.eventDate " +
            " FROM cantiga_edk_routes r" +
            " join cantiga_areas ca" +
            " on(r.areaId = ca.id)" +
            " join cantiga_territories t" +
            " on(t.id = ca.territoryId)" +
            " join cantiga_area_statuses cas" +
            " on(ca.statusId = cas.id)" +
            " where r.approved = 1";
        var conditions = [];
        conditions.push(" and cas.isPublish = 1 ");

        var values = [];
        if (territoryId) {
            conditions.push(" and t.id=?");
            values.push(territoryId)
        }
        if (excludedRouteId) {
            conditions.push(" and r.id <> ?");
            values.push(excludedRouteId)
        }

        sqlQuery = sqlQuery + (conditions.length ?
            conditions.join(' ') : '');
        sqlQuery = sqlQuery + " ORDER BY areaName, routeName"

        connection.query(sqlQuery,
            values,
            function (err, rows, field) {
                if (err) {
                    logger.error("getEdkRoutesByTerritory error: " + err);
                    callback(err);
                } else {
                    logger.info("getEdkRoutesByTerritory success");
                    callback(rows);
                }
            });
    },
    getEdkRouteList: function (territoryId, editionId, areaId, eventDate,
        orderByTerritoryName, orderByRouteName, orderByRouteLength,
        orderByEventDate, callback) {
        var sqlQuery = "select ca.id as areaId, ca.name as areaName,  ca.eventDate, ca.territoryId, ct.name, cer.id as routeId, cer.name as routeName, " +
            "cer.routeLength, cer.routeFrom, cer.routeTo, cer.updatedAt, cer.routeAscent, " +
            "cers.participantNum, cers.externalParticipantNum, (cers.participantNum + cers.externalParticipantNum) as totalParticipants, " +
            "cers.participantLimit, cers.startTime, cers.endTime, cer.descriptionFile, SUBSTRING_INDEX(mapFile,'.',-1) as filePostFix, cer.gpsTrackFile, cer.publicAccessSlug, " +
            "cer.mapUpdatedAt, cer.descriptionUpdatedAt, cer.gpsUpdatedAt " +
            "FROM admin_myapi.cantiga_areas ca " +
            "join cantiga_territories ct " +
            "on (ca.territoryId = ct.id) " +
            "join cantiga_area_statuses cas " +
            "on(ca.statusId = cas.id) " +
            "join cantiga_projects cp " +
            "on(cp.id = ca.projectId) " +
            "join cantiga_edk_routes cer " +
            "on(cer.areaId = ca.id) " +
            "join cantiga_edk_registration_settings cers " +
            "on(cers.routeId = cer.id) " +
            "where ";
        var conditions = [];
        var values = [];
        conditions.push(" cas.isPublish = 1 and cer.approved=1 ");

        if (territoryId) {
            conditions.push(" ct.id=?");
            values.push(territoryId)
        }

        conditions.push(" cp.editionId=?");

        if (editionId) {
            values.push(editionId);
        } else {
            values.push(constants.defaultEditionId);
        }

        var orderByConditions = [];

        var orderBySqlQuery = " order by ";

        sqlQueryBuilder.addOrderByCondition(orderByConditions, "ct.name", orderByTerritoryName);
        sqlQueryBuilder.addOrderByCondition(orderByConditions, "cer.name", orderByRouteName);
        sqlQueryBuilder.addOrderByCondition(orderByConditions, "cer.routeLength", orderByRouteLength);
        sqlQueryBuilder.addOrderByCondition(orderByConditions, "ca.eventDate", orderByEventDate);
        sqlQuery = sqlQuery + (conditions.length ?
            conditions.join(' and ') : '1');

        if (orderByConditions.length > 0) {

            sqlQuery = sqlQuery + orderBySqlQuery +
                orderByConditions.join(' ');
        }

        logger.info(sqlQuery);
        connection.query(sqlQuery,
            values,
            function (err, rows, field) {
                if (err) {
                    logger.error("getEdkRouteList error: " + err);
                    callback(err);
                } else {
                    logger.info("getEdkRouteList success");
                    addFileLinks(rows);
                    callback(rows);
                }
            });
    },
    getEdkRouteListForMobile: function (callback) {
        connection.query("SELECT max(editionId) as currentYearId FROM admin_myapi.cantiga_projects",
            async function  (err, rows, field) {
                if (err) {
                    logger.error("getEdkRouteListForMobile error: " + err);
                    callback(err);
                } else {
                    await edkCountersDao.waitForEdkAreasCount(rows[0].currentYearId, rows);
                    await edkCountersDao.waitForEdkRoutesCount(rows[0].currentYearId, rows);
                    await edkCountersDao.waitForTerritoriesCount(rows[0].currentYearId, rows);
                    await edkRoutesDao.waitForEdkRoutesLastUpdated(rows);
                    rows[0].countryCount = edkCountersDao.getEdkCountryCount();
                    logger.info("getEdkRouteListForMobile success : " + rows);
                    callback(rows);
                }
            });
    },
    getEdkRouteAmount: function (editionId, callback) {
        var sqlQuery = "select count(1) as routeAmount " +
            " FROM cantiga_edk_routes r " +
            " join cantiga_areas ca " +
            " on (ca.id = r.areaId) " +
            " join cantiga_projects cp " +
            " on(cp.id = ca.projectId) " +
            " join cantiga_area_statuses cas" +
            " on(ca.statusId = cas.id)" +
            " where ";
        var values = [];
        var conditions = [];
        conditions.push(" r.approved=1");
        conditions.push(" cas.isPublish = 1 ");

        if (editionId) {
            conditions.push("  cp.editionId=?");
            values.push(editionId);
        } else {
            conditions.push(" cp.editionId=2019")
        }
        sqlQuery = sqlQuery + (conditions.length ?
            conditions.join(' and ') : '');

        connection.query(sqlQuery,
            values,
            function (err, rows, field) {
                if (err) {
                    logger.error("getEdkRouteAmount error: " + err);
                    callback(err);
                } else {
                    logger.info("getEdkRouteAmount success");

                    callback(rows);
                }
            });
    },

    getEdkRouteDetail:  function (id, callback) {
        let that = this;
        var sqlQuery = "SELECT distinct ca.id as areaId," +
            " ca.name as areaName," +
            " ca.lat," +
            " ca.lng," +
            " ca.eventDate," +
            " ct.id as territoryId," +
            " ct.name as territoryName," +
            " cer.id as routeId," +
            " cer.name as routeName," +
            " cer.routeFrom," +
            " cer.routeFromDetails," +
            " cer.routeTo," +
            " cer.routeToDetails," +
            " cer.routeLength," +
            " cer.routeAscent," +
            " cer.routePatron," +
            " cer.routeColor," +
            " cer.routeCourse," +
            " cer.routeObstacles," +
            " cer.updatedAt," +
            " cer.gpsUpdatedAt," +
            " cer.mapUpdatedAt," +
            " SUBSTRING_INDEX(cer.mapFile,'.',-1) as filePostFix," +
            " cer.publicAccessSlug," +
            " cer.descriptionUpdatedAt," +
            " cers.participantNum + cers.externalParticipantNum as participantAmount," +
            " cers.startTime," +
            " cers.endTime" +
            " from cantiga_areas ca" +
            " join cantiga_territories ct" +
            " on(ca.territoryId = ct.id)" +
            " join cantiga_edk_routes cer" +
            " on(cer.areaId = ca.id)" +
            " join cantiga_edk_registration_settings cers" +
            " on(cers.routeId = cer.id)" +
            " where cer.id=?";

        connection.query(sqlQuery, [id],
            async function  (err, rows, field) {
                if (err) {
                    logger.error("getEdkRouteDetail error: " + err);
                    callback(err);
                } else {
                    addFileLinks(rows);
                    let now = Date.now();
                    if(rows[0].startTime > now || (rows[0].startTime < now && rows[0].endTime > now)) {
                        rows[0].isRegistrationOpen = true;
                    } else {
                        rows[0].isRegistrationOpen = false;
                    }
                    await that.waitForEdkRoutesByArea(rows[0].areaId, rows);
                    await edkAreaNotesDao.waitForAreaNotesContent(rows[0].areaId, rows);
                    await edkRouteNotesDao.waitForRouteNotesContent(id, rows);
                    logger.info("getEdkRouteDetail success : " + rows);
                    callback(rows);
                }
            });
    },
    getEdkRoutesLastUpdated: function (callback) {
        connection.query("SELECT max(updatedAt) as routesLastUpdate FROM admin_myapi.cantiga_edk_routes;",
            function (err, rows, field) {
                if (err) {
                    logger.error("getEdkRoutesLastUpdated error: " + err);
                    callback(null, err);
                } else {
                    logger.info("getEdkRoutesLastUpdated success");
                    callback(rows, null);
                }
            });
    },
    getEdkRoutesByUserId: function (userId, callback) {
        connection.query("select routeId from cantiga_edk_participants where id = ?;",
            userId,
            function (err, rows, field) {
                if (err) {
                    logger.error("getEdkRoutesByUserId error: " + err);
                    callback(null, err);
                } else {
                    logger.info("getEdkRoutesByUserId success");
                    callback(rows, null);
                }
            });
    },
    waitForEdkRoutesByArea:  async function (id, rows) {
        await new Promise((resolve, reject) => {
            this.getEdkRoutesByArea(id, null, (routeRows, err) => {
                if(err) {
                    reject();
                } else {
                    resolve();
                    rows[0].routes = routeRows;
                }
            });
        });
    },
    waitForEdkRoutesLastUpdated:  async function (rows) {
        await new Promise((resolve, reject) => {
            this.getEdkRoutesLastUpdated((routesLastUpdate, err) => {
                if(err) {
                    reject();
                } else {
                    resolve();
                    rows[0].routesLastUpdate = routesLastUpdate[0].routesLastUpdate;
                }
            });
        });
    }
}


function addFileLinks(rows) {
    rows.map(row => {
        row.mirror_url_gps = constants.mirror_url.replace("%HASH%", row.publicAccessSlug) + constants.gps_infix + "-" + row.routeId + ".kml";
        row.mirror_url_map = constants.mirror_url + constants.map_infix + "-" + row.routeId + "." + row.filePostFix;
        row.mirror_url_guide = constants.mirror_url + constants.guide_infix + "-" + row.routeId + ".pdf";
        delete row.filePostFix;
    });
}
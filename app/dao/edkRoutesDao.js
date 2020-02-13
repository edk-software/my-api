var connection = require('../../config/dbConnection');
const logger = require('../../config/logger')
var constants = require('../../config/constants');
const sqlQueryBuilder = require('../util/sqlQueryBuilder');

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
                    //callback(rows.map(row => row.));
                    //przeparsowac
                    //przerobic na promisy
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
                    callback(err);
                } else {
                    logger.info("getEdkRoutesByArea success");
                    callback(rows);
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
                    rows.map(row => {
                        row.mirror_url_gps = constants.mirror_url + constants.gps_infix + "-" + row.routeId + "." + row.filePostFix;
                        row.mirror_url_map = constants.mirror_url + constants.map_infix + "-" + row.routeId + "." + row.filePostFix;
                        row.mirror_url_guide = constants.mirror_url + constants.guide_infix + "-" + row.routeId + "." + row.filePostFix;
                        delete row.filePostFix;
                    });
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

    getEdkRouteDetail: function (id, callback) {
        var sqlQuery = "SELECT ca.id," +
            " ca.name as areaName," +
            " ca.lat," +
            " ca.lng," +
            " ca.eventDate," +
            " ct.id as territoryId," +
            " ct.name as territoryName," +
            " an.content," +
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
            " cer.descriptionUpdatedAt," +
            " cers.participantNum," +
            " cers.externalParticipantNum," +
            " cers.startTime," +
            " cers.endTime" +
            " from cantiga_areas ca" +
            " join cantiga_territories ct" +
            " on(ca.territoryId = ct.id)" +
            " join cantiga_edk_area_notes an" +
            " on(ca.id = an.areaId)" +
            " join cantiga_edk_routes cer" +
            " on(cer.areaId = ca.id)" +
            " join cantiga_edk_registration_settings cers" +
            " on(cers.areaId = ca.id)" +
            " where cer.id=?"

        logger.info(sqlQuery);
        logger.info("TEKSTTEKST " + id + " TEKSTTEKST");

        connection.query(sqlQuery, [id],
            function (err, rows, field) {
                if (err) {
                    logger.error("getEdkRouteDetail error: " + err);
                    callback(err);
                } else {
                    logger.info("getEdkRouteDetail success : " + rows);
                    callback(rows);
                }
            });
    }
}
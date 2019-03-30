var connection = require('../../config/dbConnection');
const logger = require('../../config/logger')

module.exports = {

    getEdkRoute: function(id, editionId, callback) {
        var sqlQuery = "SELECT r.id as routeId, r.name as routeName, ca.id as areaId, ca.name as areaName, r.routeType, r.routePatron, r.routeColor," +
            " r.routeAuthor, r.routeFrom, r.routeFromDetails, r.routeTo, r.routeToDetails," +
            " r.routeCourse, r.routeLength, r.routeAscent, r.routeObstacles, r.createdAt, r.updatedAt," +
            " crs.startTime, crs.endTime, crs.participantLimit, crs.participantNum," +
            " if(r.mapFile is not null, concat_ws('/', (select `value` from cantiga_project_settings where `key` = 'edk_mirror_url' AND `projectId` = ca.projectId),r.publicAccessSlug, CONCAT('edk-map-route-',r.id, '.', SUBSTRING_INDEX(r.mapFile,'.',-1))) , null) as mapLink, " +
            " if(r.gpsTrackFile is not null, concat_ws('/', (select `value` from cantiga_project_settings where `key` = 'edk_mirror_url' AND `projectId` = ca.projectId),r.publicAccessSlug, CONCAT('edk-gps-route-',r.id, '.', SUBSTRING_INDEX(r.gpsTrackFile,'.',-1))), null) as gpsLink," +
            " if(r.descriptionFile is not null ,concat_ws('/', (select `value` from cantiga_project_settings where `key` = 'edk_mirror_url' AND `projectId` = ca.projectId),r.publicAccessSlug, CONCAT('edk-guide-route-',r.id, '.', SUBSTRING_INDEX(r.descriptionFile,'.',-1))), null) as DescriptionLink," +
            " GROUP_CONCAT(rn.content SEPARATOR \"$|%\") as note," +
            " (crs.participantNum + crs.externalParticipantNum) as allParticipantNumber " +
            " FROM cantiga_edk_routes r "+
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
        } else if(editionId) {
            conditions.push("  cp.editionId=?");
            values.push(editionId);
        } else {
            conditions.push(" cp.editionId=2019")
        }
        sqlQuery = sqlQuery + (conditions.length ?
                conditions.join(' and ') : '');

        sqlQuery = sqlQuery + "  group by r.id";

        connection.query(sqlQuery,
        values, function (err, rows, field) {
        if (err) {
            logger.error("getEdkRoute error: " +err);
            callback(err);
        } else {
            logger.info("getEdkRoute success");
            callback(rows);
        }
    });
} ,   getEdkRoutesByArea: function(areaId, excludedRouteId, callback) {
        var sqlQuery = "SELECT r.id as id, r.name, r.routeFrom as start, r.routeTo as end, "
            + " r.routeLength as length, r.routeAscent as ascent  FROM cantiga_edk_routes r"
            + " inner join cantiga_areas ca"
            + " on(r.areaId = ca.id)"
            + " where approved = 1";
        var conditions = [];
        var values = [];
        if(areaId){
            conditions.push(" and ca.id=?");
            values.push(areaId)
        }
        if(excludedRouteId){
            conditions.push(" and r.id <> ?");
            values.push(excludedRouteId)
        }

        sqlQuery = sqlQuery + (conditions.length ?
                conditions.join(' ') : '');
        connection.query(sqlQuery,
            values, function (err, rows, field) {
                if (err) {
                    logger.error("getEdkRoutesByArea error: " +err);
                    callback(err);
                } else {
                    logger.info("getEdkRoutesByArea success");
                    callback(rows);
                }
            });
    },
    getEdkRoutesByTerritory: function(territoryId, excludedRouteId, callback) {
        var sqlQuery = "SELECT r.id as routeId, ca.id as areaId, t.id as territoryId,"
            + " r.name as routeName, ca.name as areaName, t.name as territoryName,"
            + " r.routeFrom, r.routeTo, r.routeLength, r.routeAscent, ca.eventDate "
            + " FROM cantiga_edk_routes r"
            + " join cantiga_areas ca"
            + " on(r.areaId = ca.id)"
            + " join cantiga_territories t"
            + " on(t.id = ca.territoryId)"
            + " join cantiga_area_statuses cas"
            + " on(ca.statusId = cas.id)"
            + " where r.approved = 1";
        var conditions = [];
        conditions.push(" and cas.isPublish = 1 ");

        var values = [];
        if(territoryId){
            conditions.push(" and t.id=?");
            values.push(territoryId)
        }
        if(excludedRouteId){
            conditions.push(" and r.id <> ?");
            values.push(excludedRouteId)
        }

        sqlQuery = sqlQuery + (conditions.length ?
                conditions.join(' ') : '');
        sqlQuery = sqlQuery + " ORDER BY areaName, routeName"

        connection.query(sqlQuery,
            values, function (err, rows, field) {
                if (err) {
                    logger.error("getEdkRoutesByTerritory error: " +err);
                    callback(err);
                } else {
                    logger.info("getEdkRoutesByTerritory success");
                    callback(rows);
                }
            });
    },
    getEdkRouteList: function(territoryId, editionId, callback) {
        var sqlQuery = "SELECT r.id, ct.id as territoryId, r.name as routeName, r.routeLength, r.routeType,"
            + " ct.name as territoryName, ct.locale, ca.id as areaId, ca.name as areaName FROM cantiga_edk_routes r"
            + " inner join cantiga_areas ca"
            + " on(r.areaId = ca.id)"
            + " join cantiga_territories ct"
            + " on(ca.territoryId = ct.id)"
            + " join cantiga_projects cp"
            + " on(ca.projectId=cp.id)"
            + " join cantiga_area_statuses cas"
            + " on(ca.statusId = cas.id)"
            + " where ";
        var conditions = [];
        var values = [];
        conditions.push(" cas.isPublish = 1 and r.approved=1 ");

        if(territoryId){
            conditions.push(" ct.id=?");
            values.push(territoryId)
        }

        if(editionId){
            conditions.push(" cp.editionId=?");
            values.push(editionId);
        }
        else {
            conditions.push(" cp.editionId=2019");
        }

        sqlQuery = sqlQuery + (conditions.length ?
                conditions.join(' and ') : '1');

        sqlQuery = sqlQuery + " ORDER BY areaName, routeName"
        connection.query(sqlQuery,
            values, function (err, rows, field) {
                if (err) {
                    logger.error("getEdkRouteList error: " +err);
                    callback(err);
                } else {
                    logger.info("getEdkRouteList success" );
                    callback(rows);
                }
            });
    },
    getEdkRouteAmount: function( editionId, callback){
        var sqlQuery = "select count(1) as routeAmount " +
            " FROM cantiga_edk_routes r "+
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

        if(editionId) {
            conditions.push("  cp.editionId=?");
            values.push(editionId);
        } else {
            conditions.push(" cp.editionId=2019")
        }
        sqlQuery = sqlQuery + (conditions.length ?
                conditions.join(' and ') : '');

        connection.query(sqlQuery,
            values, function (err, rows, field) {
                if (err) {
                    logger.error("getEdkRouteAmount error: " +err);
                    callback(err);
                } else {
                    logger.info("getEdkRouteAmount success");
                    callback(rows);
                }
            });
    }

};

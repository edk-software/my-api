var connection = require('../../config/dbConnection');
const logger = require('../../config/logger');
var constants = require('../../config/constants');
const sqlQueryBuilder = require('../util/sqlQueryBuilder');
var edkRoutesDao = require('./edkRoutesDao');
var edkAreaNotesDao = require('./edkAreasNotesDao');




module.exports = {

    getEdkAreas: function(id, editionId, callback) {
        var sqlQuery = "SELECT ca.id as areaId,  ca.name as areaName, ct.id as territoryId, ct.name as territoryName,"
            + " ca.lat as latitude, ca.lng as longitude, ca.eventDate, ca.customData, cas.name as areaStatus,"
            + " GROUP_CONCAT(an.content SEPARATOR \"$|%\") as note"
            + " FROM cantiga_areas ca"
            + " join cantiga_area_statuses cas"
            + " on(ca.statusId = cas.id)"
            + " join cantiga_territories ct"
            + " on(ca.territoryId = ct.id)"
            + " join cantiga_projects cp"
            + " on(ca.projectId=cp.id)"
            + " left join cantiga_edk_area_notes an"
            + " on(ca.id = an.areaId)"
            + " where cas.isPublish = 1" ;
        var values =[];
        if(id) {
            sqlQuery = sqlQuery + " and ca.id =?";
            values.push(id);
        }
        if(editionId) {

        } else {
            editionId = constants.defaultEditionId;
            sqlQuery = sqlQuery + " and cp.editionId =?";
            values.push(editionId);

        }
        sqlQuery = sqlQuery + "  group by ca.id";
        connection.query(sqlQuery,
            values, function (err, rows, field) {
                if (err) {
                    logger.error("getEdkAreas error: " +err);
                    callback(err);
                } else {
                                      callback(rows);
                    logger.info("getEdkAreas success");
                }
            });
    },
//do uwspólnienia z powyższą
    getEdkAreasDetail: function(id, callback) {
        connection.query("SELECT ca.id, an.noteType, an.content, an.lastUpdatedAt from cantiga_areas ca"
        + " join cantiga_edk_area_notes an"
        + " on(ca.id = an.areaId) "
        + " join cantiga_area_statuses cas"
        + " on(ca.statusId = cas.id)"
        + " where cas.isPublish = 1 and ca.id=?", [id], function (err, rows, field) {
                if (err) {
                    logger.error("getEdkAreasDetail error: " +err);
                    callback(err);
                } else {
                    logger.info("getEdkAreasDetail success : " + rows);
                    callback(rows);
                }
            });
    } ,    getEdkAreasByTerritory: function(territoryId, callback) {
        connection.query("SELECT ca.* FROM cantiga_areas ca"
            + " join cantiga_territories ct"
            + " on(ca.territoryId = ct.id)"
            + " join cantiga_area_statuses cas"
            + " on(ca.statusId = cas.id)"
            + " where cas.isPublish = 1 and ct.id=?"
            , [territoryId], function (err, rows, field) {
                if (err) {
                    logger.error("getEdkAreasByTerritory error: " +err);
                    callback(err);
                } else {
                    logger.info("getEdkAreasByTerritory success : " + rows);
                    callback(rows);
                }
            });
    } ,
    getEdkAreaList: function(territoryId, editionId, areaId, eventDate, orderByAreaName, orderByTerritoryName,
                             orderByRouteName, orderByRouteLength, orderByEventDate, callback) {
        var sqlQuery = "SELECT " +
            "ca.id as areaId, ca.name as areaName, ca.lat as latitude, ca.lng as longitude," +
            " ca.eventDate as eventDate, ca.territoryId , ct.name as territoryName, " +
            "cer.id as routeId, cer.name as routeName, " +
            "cer.routeLength, cer.routeFrom, cer.routeTo, cer.updatedAt, cer.routeAscent " +
            "FROM admin_myapi.cantiga_areas ca " +
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

        var conditions = [];
        var values = [];
        if(territoryId) {
            conditions.push(" and ct.id=?");
            values.push(territoryId);
        }

        if(areaId){
            conditions.push(" and ca.id=?");
            values.push(areaId);
        }

        if(eventDate){
            conditions.push(" ca.eventDate=?");
            values.push(eventDate);
        }

        conditions.push(" and cp.editionId=?");
        if(editionId){
            values.push(editionId);
        }else {
            values.push(constants.defaultEditionId);
        }

        var orderByConditions  = [];

        var orderBySqlQuery = " order by ";

        sqlQueryBuilder.addOrderByCondition(orderByConditions,  "ca.name", orderByAreaName);
        sqlQueryBuilder.addOrderByCondition(orderByConditions,  "ct.name", orderByTerritoryName);
        sqlQueryBuilder.addOrderByCondition(orderByConditions,  "cer.name", orderByRouteName);
        sqlQueryBuilder.addOrderByCondition(orderByConditions,  "cer.routeLength", orderByRouteLength);
        sqlQueryBuilder.addOrderByCondition(orderByConditions,  "ca.eventDate", orderByEventDate);


        sqlQuery = sqlQuery + (conditions.length ?
            conditions.join(' ') : '');


        if(orderByConditions.length > 0) {

            sqlQuery = sqlQuery + orderBySqlQuery +
                orderByConditions.join(' ');
        }

        logger.info(sqlQuery);

        function addNewArea(row, parsedRows) {
            let routeList = [];
            routeList.push({
                "routeId": row.routeId,
                "routeName": row.routeName,
                "routeLength": row.routeLength,
                "routeFrom": row.routeFrom,
                "routeTo": row.routeTo,
                "updatedAt": row.updatedAt,
                "routeAscent": row.routeAscent,
            });

            parsedRows.push({
                "areaId": row.areaId,
                "areaName": row.areaName,
                "latitude": row.latitude,
                "longitude": row.longitude,
                "eventDate": row.eventDate,
                "territoryId": row.territoryId,
                "eventName": row.eventName,
                "routeList": routeList,
            });
        }

        connection.query(sqlQuery,
            values, function (err, rows, field) {
                if (err) {
                    logger.error("getEdkAreaList error: " +err);
                    callback(err);
                } else {
                    logger.info("getEdkAreaList success ");
                    var parsedRows=[];
                    rows.forEach(function(row) {
                        if(parsedRows.length === 0) {
                            addNewArea(row, parsedRows);
                        } else {
                            var isAreaExist = false;
                            parsedRows.forEach(function (parsedRow) {
                                if(parsedRow.areaName == row.areaName) {
                                    parsedRow.routeList.push({
                                        "routeId": row.routeId,
                                        "routeName": row.routeName,
                                        "routeLength": row.routeLength,
                                        "routeFrom": row.routeFrom,
                                        "routeTo": row.routeTo,
                                        "updatedAt": row.updatedAt,
                                        "routeAscent": row.routeAscent,
                                    });
                                    isAreaExist = true;
                                }
                            });
                            if(!isAreaExist) {
                                addNewArea(row, parsedRows);
                            }
                        }
                    });
                    callback(parsedRows);
                }
            });
    },
    getEdkAreaAmount: function( editionId, callback) {
        var sqlQuery = "select count(1) as areaAmount"
            + " from cantiga_areas ca "
            + " join  cantiga_area_statuses cas"
            + " on(ca.statusId = cas.id)"
            + " join cantiga_projects cp"
            + " on(ca.projectId=cp.id)"
            + " where cas.isPublish = 1 ";
        var conditions = [];
        var values = [];
        if(editionId){
            conditions.push(" and cp.editionId=?");
            values.push(editionId)
        }else {
            sqlQuery = sqlQuery + " and cp.editionId=2019";
        }

        sqlQuery = sqlQuery + (conditions.length ?
                conditions.join(' ') : '');
        connection.query(sqlQuery,
            values, function (err, rows, field) {
                if (err) {
                    logger.error("getEdkAreaAmount error: " +err);
                    callback(err);
                } else {
                    logger.info("getEdkAreaAmount success : " + rows);
                    callback(rows);
                }
            });
    },
    getNewAreaDetail: function(id, callback) {
        var sqlQuery = "SELECT" +
            " ca.id as areaId," +
            " ca.name as areaName," +
            " ca.lat," +
            " ca.lng," +
            " ca.eventDate," +
            " ct.id as territoryId," +
            " ct.name as territoryName," +
            " ca.customData" +
            " FROM cantiga_areas ca" +
            " join cantiga_territories ct" +
            " on(ca.territoryId = ct.id)" +
             " where ca.id=?";
        connection.query(
        sqlQuery, [id], async function (err, rows, field) {
            if (err) {
                logger.error("getNewAreaDetail error: " +err);
                callback(err);
            } else {
                await edkRoutesDao.waitForEdkRoutesByArea(id, rows);
                await edkAreaNotesDao.waitForAreaNotesContent(id,rows);
                logger.info("getNewAreaDetail success : " + rows);
                callback(rows);
            }
        });
    }
}

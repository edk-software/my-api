var connection = require('../../config/dbConnection');
const logger = require('../../config/logger');
var constants = require('../../config/constants');
const sqlQueryBuilder = require('../util/sqlQueryBuilder');
var edkRoutesDao = require('./edkRoutesDao');
var edkAreaNotesDao = require('./edkAreasNotesDao');


module.exports = {

    getEdkAreas: function (territoryId, editionId, eventDate, orderByAreaName, orderByTerritoryName,
                           orderByEventDate, searchAreaName, callback) {
        var sqlQuery = "SELECT " +
            "ca.id as areaId, ca.name as areaName, ca.lat as latitude, ca.lng as longitude, " +
            "ca.eventDate as eventDate, ca.territoryId , ct.name as territoryName, " +
            "count(DISTINCT cer.id) as routesCount " +
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

        var conditions = [];
        var values = [];
        if (territoryId) {
            conditions.push(" and ct.id=?");
            values.push(territoryId);
        }

        if (searchAreaName) {
            conditions.push(" and ca.name like ? ");
            values.push("%" + searchAreaName + "%");
        }

        if (eventDate) {
            conditions.push(" ca.eventDate=?");
            values.push(eventDate);
        }

        conditions.push(" and cp.editionId=?");
        if (editionId) {
            values.push(editionId);
        } else {
            values.push(constants.defaultEditionId);
        }

        let orderByConditions = [];

        let sqlGroupBySql = " group by areaId ";

        let orderBySqlQuery = " order by ";


        sqlQueryBuilder.addOrderByCondition(orderByConditions, "ca.name", orderByAreaName);
        sqlQueryBuilder.addOrderByCondition(orderByConditions, "ct.name", orderByTerritoryName);
        sqlQueryBuilder.addOrderByCondition(orderByConditions, "ca.eventDate", orderByEventDate);

        sqlQuery = sqlQuery + (conditions.length ?
            conditions.join(' ') : '') + sqlGroupBySql;

        if (orderByConditions.length > 0) {

            sqlQuery = sqlQuery + orderBySqlQuery +
                orderByConditions.join(' ');
        }

        logger.info(sqlQuery);

        connection.query(sqlQuery,
            values, function (err, rows, field) {
                if (err) {
                    logger.error("getEdkAreaList error: " + err);
                    callback(err);
                } else {
                    callback(rows);
                }
            });
    },
//do uwspólnienia z powyższą
    getEdkAreasDetail: function (id, callback) {
        connection.query("SELECT ca.id, an.noteType, an.content, an.lastUpdatedAt from cantiga_areas ca"
            + " join cantiga_edk_area_notes an"
            + " on(ca.id = an.areaId) "
            + " join cantiga_area_statuses cas"
            + " on(ca.statusId = cas.id)"
            + " where cas.isPublish = 1 and ca.id=?", [id], function (err, rows, field) {
            if (err) {
                logger.error("getEdkAreasDetail error: " + err);
                callback(err);
            } else {
                callback(rows);
            }
        });
    },
    getAreaDetail: function (id, callback) {
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
                    logger.error("getAreaDetail error: " + err);
                    callback(err);
                } else {
                    await edkRoutesDao.waitForEdkRoutesByArea(id, rows);
                    await edkAreaNotesDao.waitForAreaNotesContent(id, rows);
                    callback(rows);
                }
            });
    }
}

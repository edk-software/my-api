const connection = require('../../config/dbConnection');
const logger = require('../../config/logger');
const constants = require('../../config/constants');
const sqlQueryBuilder = require('../util/sqlQueryBuilder');

module.exports = {

    getEdkTerritoryList: function(editionId, eventDate, orderByTerritoryId, orderByTerritoryName,  callback) {

        var sqlQuery = "SELECT " +
            "ct.id, ct.name, COUNT(DISTINCT ca.id) as areaCount, count(distinct cer.id) as routeCount, " +
            "cp.editionId " +
            "FROM cantiga_areas ca " +
            "join cantiga_territories ct " +
            "on (ca.territoryId = ct.id) " +
            "join cantiga_area_statuses cas " +
            "on(ca.statusId = cas.id) " +
            "join cantiga_projects cp " +
            "on(cp.id = ca.projectId) " +
            "join cantiga_edk_routes cer " +
            "on(cer.areaId = ca.id) " +
            "where cas.isPublish = 1 "+
            "and cer.approved = 1 ";
        var conditions = [];
        var values = [];
        conditions.push(" and cp.editionId=?");

        logger.info("before eventDate", eventDate);

        if(editionId){
            values.push(editionId);
        }else {
            values.push(constants.defaultEditionId);
        }

        logger.info("before eventDate", eventDate);
        if(eventDate){
            conditions.push(" and ca.eventDate=?");
            values.push(eventDate);
        }

        logger.info("beforeSqlGroup");
        var sqlGroupBySql = " group by ct.id, ct.name ";

        var orderByConditions  = [];

        var orderBySqlQuery = " order by ";

        sqlQueryBuilder.addOrderByCondition(orderByConditions,  "ct.id", orderByTerritoryId);
        sqlQueryBuilder.addOrderByCondition(orderByConditions,  "ct.name", orderByTerritoryName);

        sqlQuery = sqlQuery + (conditions.length ?
            conditions.join(' ') : '') + sqlGroupBySql;

        if(orderByConditions.length > 0) {

            sqlQuery = sqlQuery + orderBySqlQuery +
                orderByConditions.join(' ');
        }


        connection.query(sqlQuery, values,
             function (err, rows, field) {
                if (err) {
                    logger.error("getEdkTerritoryList error: " +err);
                    callback(err);
                } else {
                    logger.info("getEdkTerritoryList success" );
                    callback(rows);
                }
            });
    }
};

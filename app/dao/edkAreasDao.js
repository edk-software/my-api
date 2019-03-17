var connection = require('../../config/dbConnection');
const logger = require('../../config/logger');

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
            sqlQuery = sqlQuery + " and cp.editionId =?";
            values.push(editionId);
        } else {
            sqlQuery = sqlQuery + " and cp.editionId=2019";
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
    getEdkAreaList: function(territoryId, editionId, callback) {
        var sqlQuery = "select ca.id, ca.name as city, ca.lat as latitude, ca.lng as longitude, cas.name as status_name, ct.name as territory_name from cantiga_areas ca "
            + " join  cantiga_area_statuses cas"
            + " on(ca.statusId = cas.id)"
            + " join cantiga_territories ct"
            + " on(ca.territoryId = ct.id)"
            + " join cantiga_projects cp"
            + " on(ca.projectId=cp.id)"
            + " where cas.isPublish = 1 ";
        var conditions = [];
        var values = [];
        if(territoryId){
            conditions.push(" and ct.id=?");
            values.push(territoryId)
        }

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
                    logger.error("getEdkAreaList error: " +err);
                    callback(err);
                } else {
                    logger.info("getEdkAreaList success : " + rows);
                    callback(rows);
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
    }



}

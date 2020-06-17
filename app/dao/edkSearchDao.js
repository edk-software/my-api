var connection = require('../../config/dbConnection');
const logger = require('../../config/logger');

module.exports = {


    getEdkSearch: function (textSearch, callback) {
        let result = {
            isRoutesQueryFinished: false,
            isAreaQueryFinished: false,
            isTerritoryFinished: false,
            rows: []
        }
        searchByRoutes(textSearch, callback, result);
        searchByAreas(textSearch, callback, result);
        searchByTerritories(textSearch, callback, result);
    }
}

 function searchByAreas(textSearch, callback, result) {
    var sqlQuery = "SELECT ca.name as area_name, 'areas'"
        + " FROM cantiga_areas ca"
        + " WHERE ca.name"
        + " LIKE '%" + textSearch + "%'";
    connection.query(sqlQuery,
         function (err, rows, field) {
            result.isAreaQueryFinished = true;
            if (err) {
                logger.error("getEdkSearch error: " +err);
                callback(err);
            } else {
                logger.info("getEdkSearch success" );
                result.rows = result.rows.concat(rows);
                if(result.isRoutesQueryFinished && result.isTerritoryFinished) {
                    callback(result.rows);
                }
            }
        });
};

 function searchByRoutes(textSearch, callback, result) {
    var sqlQuery = "SELECT r.name as route_name, 'routes'"
        + " FROM cantiga_edk_routes r"
        + " WHERE r.name"
        + " LIKE '%" + textSearch + "%'";
    connection.query(sqlQuery,
         function (err, rows, field) {
             result.isRoutesQueryFinished = true;
             if (err) {
                 logger.error("getEdkSearch error: " +err);
                 callback(err);
             } else {
                 logger.info("getEdkSearch success" );
                 result.rows = result.rows.concat(rows);
                 if(result.isAreaQueryFinished  && result.isTerritoryFinished) {
                     callback(result.rows);
                 }
             }
        });
 }

 function searchByTerritories(textSearch, callback, result) {
     var sqlQuery = "SELECT ct.name as territoryName, 'territories'"
         + " FROM cantiga_territories ct"
         + " WHERE ct.name"
         + " LIKE '%" + textSearch + "%'";
     connection.query(sqlQuery,
         function (err, rows, field) {
             result.isTerritoryFinished = true;
             if (err) {
                 logger.error("getEdkSearch error: " + err);
                 callback(err);
             } else {
                 logger.info("getEdkSearch success");
                 result.rows = result.rows.concat(rows);
                 if (result.isAreaQueryFinished && result.isRoutesQueryFinished) {
                     callback(result.rows);
                 }
             }
         });
 }



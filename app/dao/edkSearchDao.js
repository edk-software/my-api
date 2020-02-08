var connection = require('../../config/dbConnection');
const logger = require('../../config/logger');

module.exports = {


    getEdkSearch: function (textSearch, callback) {
        var sqlQuery = "SELECT ca.name as area_name, r.name as routes_name"
            + " FROM cantiga_areas ca"
            + " INNER JOIN cantiga_edk_routes r"

            +  " ON r.areaId = ca.id"
            + " WHERE ca.name"
            + " LIKE '%" + textSearch+ "%'"
            + " OR r.name"
            + " LIKE '%" + textSearch+ "%'";

        logger.info(sqlQuery);
        connection.query(sqlQuery, function (err, rows, field) {
                if (err) {
                    logger.error("getEdkSearch error: " + err);
                    callback(err);
                } else {
                    logger.info("getEdkSearch success");
                    callback(rows);
                }
            });
    }
};
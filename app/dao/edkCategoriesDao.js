var connection = require('../../config/dbConnection');
const logger = require('../../config/logger')

module.exports = {

    getEdkCategories: function( callback) {
        var sqlQuery = "select * from cantiga_edk_categories;";
        connection.query(sqlQuery,
             function (err, rows, field) {
                if (err) {
                    logger.error("getEdkCategories error : " + err);
                    callback(err);
                } else {
                    logger.info("getEdkCategories success");
                    callback(rows);
                }
            });
    }

};

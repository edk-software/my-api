var connection = require('../../config/dbConnection');
const logger = require('../../config/logger');

module.exports = {
    getEdkCountryAmount: function( editionId, callback) {
        connection.query("select 25 as countryAmount from dual",
            function (err, rows, field) {
                if (err) {
                    logger.error("getEdkCountryAmount error : " + err);
                    callback(err);
                } else {
                    logger.info("getEdkCountryAmount success");
                    callback(rows);
                }
            });
    }
}
var connection = require('../../config/dbConnection');
const logger = require('../../config/logger');

module.exports = {

    getEdkRegistrations: function (id, callback) {
        connection.query("SELECT * FROM cantiga_user_registrations where id =?",
            [id], function (err, rows, field) {
                if (err) {
                    logger.error("getEdkRegistrations error: " +err);
                    callback(err);
                } else {
                    logger.info("getEdkRegistrations success");
                    callback(rows);
                }
            });
    }
}


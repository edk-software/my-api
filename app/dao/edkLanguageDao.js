var connection = require('../../config/dbConnection');
const logger = require('../../config/logger')

module.exports = {

    getEdkLanguage: function (projectId, callback) {
        connection.query("SELECT * FROM cantiga_projects_language where project_id =?",
            [projectId], function (err, rows, field) {
                if (err) {
                    logger.error("getEdkLanguage error : " + err);
                    callback(err);
                } else {
                    logger.info("getEdkLanguage success");
                    callback(rows);
                }
            });
    }
}


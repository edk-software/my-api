var connection = require('../../config/dbConnection');
const logger = require('../../config/logger')

module.exports = {


    getEdkReflections: function(id, projectId, callback) {
        var sqlQuery = "SELECT * FROM cantiga_edk_reflections r"
            + " where ";
        var conditions = [];
        var values = [];
        if(id){
            conditions.push(" r.id=?");
            values.push(territoryId)
        }

        if(projectId){
            conditions.push(" r.project_id=?");
            values.push(projectId)
        }

        sqlQuery = sqlQuery + (conditions.length ?
                conditions.join(' and ') : '1');
        connection.query(sqlQuery,
            values, function (err, rows, field) {
                if (err) {
                    logger.error("getEdkReflections error: " +err);
                    callback(err);
                } else {
                    logger.info("getEdkReflections success");
                    callback(rows);
                }
            });
    }

};

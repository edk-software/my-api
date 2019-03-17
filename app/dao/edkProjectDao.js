
var connection = require('../../config/dbConnection');
const logger = require('../../config/logger')

module.exports = {

    getEdkProjects: function (id, callback) {
        var sqlQuery = "SELECT * FROM cantiga_projects";
        var values = [];
        if(id){
            sqlQuery = sqlQuery + "  where id =?";
            values.push(id);
        }
        connection.query(sqlQuery,
            values, function (err, rows, field) {
                if (err) {
                    logger.error("getEdkProjects error : " + err);
                    callback(err);
                } else {
                    logger.info("getEdkProjects success");
                    callback(rows);
                }
            });
    }
}



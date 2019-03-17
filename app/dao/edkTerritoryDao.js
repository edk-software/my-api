var connection = require('../../config/dbConnection');
const logger = require('../../config/logger');

module.exports = {

    getEdkTerritoryList: function(column, order, editionId, callback) {
        var sqlQuery = "select distinct ct.id, ct.name, ct.locale from cantiga_territories ct"
        + " join cantiga_areas ca"
        + " on(ct.id=ca.territoryId)"
        + " join cantiga_projects cp"
        + " on (cp.id = ca.projectId)"
        + " where ";
        var values =[];
        if(editionId) {
            sqlQuery = sqlQuery + " cp.editionId=?";
            values.push(editionId);
        } else {
            sqlQuery = sqlQuery + " cp.editionId=2019";
        }

        sqlQuery = sqlQuery +  addOrderByClause(column, order);
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

function addOrderByClause(column , order) {
    if(!column || ("name" != column && "locale" != column)) {
        column = "id";
    }
    if(!order ||  order != "desc") {
        order = "asc";
    }
    return " order by " + column + " " + order;
}
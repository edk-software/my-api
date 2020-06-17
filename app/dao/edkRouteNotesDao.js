var connection = require('../../config/dbConnection');
const logger = require('../../config/logger');

module.exports = {

    getAreaRouteContent: function (routeId, callback) {
        var sqlQuery = "SELECT" +
            " content" +
            " FROM cantiga_edk_route_notes" +
            " where routeId=?";
        connection.query(
            sqlQuery, [routeId], async function (err, rows, field) {
                if (err) {
                    logger.error("getEdkRouteNotes error: " + err);
                    callback(null, err);
                } else {
                    callback(rows, null);
                }
            });
    },

    waitForRouteNotesContent: async function (id, rows) {
        await new Promise((resolve, reject) => {
            this.getAreaRouteContent(id, (contents, err) => {
                if (err) {
                    reject();
                } else {
                    resolve();
                    rows[0].routeContents = contents;
                }
            });
        });
    }
}
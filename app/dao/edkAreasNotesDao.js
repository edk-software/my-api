var connection = require('../../config/dbConnection');
const logger = require('../../config/logger');

module.exports = {

    getAreaNotesContent: function (areaId, callback) {
        var sqlQuery = "SELECT" +
            " content" +
            " FROM cantiga_edk_area_notes" +
            " where areaId=?";
        connection.query(
            sqlQuery, [areaId], async function (err, rows, field) {
                if (err) {
                    logger.error("getEdkAreaNotes error: " + err);
                    callback(null, err);
                } else {
                    callback(rows, null);
                }
            });
    },

    waitForAreaNotesContent: async function (id, rows) {
        await new Promise((resolve, reject) => {
            this.getAreaNotesContent(id, (contents, err) => {
                if (err) {
                    reject();
                } else {
                    resolve();
                    rows[0].areaContents = contents;
                }
            });
        });
    }
}
var connection = require('../../config/dbConnection');
const logger = require('../../config/logger')

module.exports = {

    getEdkRegistrationSettings: function(routeId, callback) {
        connection.query("select startTime, endTime, participantNum, externalParticipantNum,  (participantNum + externalParticipantNum) as allParticipantAmount from cantiga_edk_registration_settings where routeId=?",
            [routeId], function (err, rows, field) {
                if (err) {
                    logger.error("getEdkRegistrationSettings error: " + err);
                    callback(err);
                } else {
                    logger.info("getEdkRegistrationSettings success");
                    callback(rows);
                }
            });
    },
    getEdkParticipantAmount: function(editionId, callback) {
    var sqlQuery = "select sum(rs.participantNum) + sum(rs.externalParticipantNum) as participantAmount "
        + " from cantiga_edk_registration_settings rs"
        + " join cantiga_edk_routes r"
        + " on(r.id = rs.routeId)"
        + " join cantiga_areas ca"
        + " on(ca.id = r.areaId)"
        + " join cantiga_projects cp"
        + " on(cp.id = ca.projectId)"
        + " where ";

        var values = [];
        var conditions = [];
        if(editionId) {
            conditions.push("  cp.editionId=?");
            values.push(editionId);
        } else {
            conditions.push(" cp.editionId=2019")
        }
        sqlQuery = sqlQuery + (conditions.length ?
                conditions.join('') : '');
        connection.query(sqlQuery,
            values, function (err, rows, field) {
                if (err) {
                    logger.error("getEdkParticipants error: " +err);
                    callback(err);
                } else {
                    logger.info("getEdkParticipants success");
                    callback(rows);
                }
            });
    }

};

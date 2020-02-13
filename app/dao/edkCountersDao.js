var connection = require('../../config/dbConnection');
const logger = require('../../config/logger')

module.exports = {

    getEdkUsersRegistrationCount: function (callback) {
        connection.query("SELECT sum(participantNum + externalParticipantNum) FROM admin_myapi.cantiga_edk_registration_settings;",
            function (err, rows, field) {
                if (err) {
                    logger.error("getEdkUsersRegistrationCount error: " + err);
                    callback(err);
                } else {
                    logger.info("getEdkUsersRegistrationCount success");
                    callback(rows);
                }
            });
    },

    getEdkRoutesCount: function (callback) {
        connection.query("SELECT count(1) FROM cantiga_edk_routes",
            function (err, rows, field) {
                if (err) {
                    logger.error("getEdkRoutesCount error: " + err);
                    callback(err);
                } else {
                    logger.info("getEdkRoutesCount success");
                    callback(rows);
                }
            });
    },

    getEdkAreasCount: function (callback) {
        connection.query("SELECT count(1) FROM cantiga_areas",
            function (err, rows, field) {
                if (err) {
                    logger.error("getEdkAreasCount error: " + err);
                    callback(err);
                } else {
                    logger.info("getEdkAreasCount success");
                    callback(rows);
                }
            });
    },

    getEdkTerritoriesCount: function (callback) {
        connection.query("SELECT count(1) FROM cantiga_territories",
            function (err, rows, field) {
                if (err) {
                    logger.error("getEdkTerritoriesCount error: " + err);
                    callback(err);
                } else {
                    logger.info("getEdkTerritoriesCount success");
                    callback(rows);
                }
            });
    }

};
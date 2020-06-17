const connection = require('../../config/dbConnection');
const logger = require('../../config/logger')
const constants = require('../../config/constants');

module.exports = {

    getEdkUsersRegistrationCount: function (editionId, callback) {
        let sqlQuery =  "SELECT sum(participantNum + externalParticipantNum) as participantNum" +
            " FROM cantiga_edk_registration_settings cers" +
            " join cantiga_areas ca" +
            " on ca.id = cers.areaId" +
            " join cantiga_projects cp" +
            " on cp.id = ca.projectId " +
            " where cp.editionId=?";
        let values = [];

        if(editionId){
            values.push(editionId);
        }else {
            values.push(constants.defaultEditionId);
        }
        connection.query(sqlQuery, values,
            function (err, rows, field) {
                if (err) {
                    logger.error("getEdkUsersRegistrationCount error: " + err);
                    callback(null, err);
                } else {
                    logger.info("getEdkUsersRegistrationCount success");
                    callback(rows, null);
                }
            });
    },

    getEdkRoutesCount: function (editionId, callback) {
        let sqlQuery =  "SELECT count(1) as routesCount " +
            " from cantiga_edk_routes cer" +
            " join cantiga_areas ca" +
            " on ca.id = cer.areaId" +
            " join cantiga_area_statuses cas" +
            " on ca.statusId = cas.id" +
            " join cantiga_projects cp" +
            " on cp.id = ca.projectId" +
            " where cas.isPublish = 1 AND cer.approved = 1 AND cp.editionId=?";
        let values = [];

        if(editionId){
            values.push(editionId);
        }else {
            values.push(constants.defaultEditionId);
        }

        connection.query(sqlQuery, values,
            function (err, rows, field) {
                if (err) {
                    logger.error("getEdkRoutesCount error: " + err);
                    callback(null, err);
                } else {
                    logger.info("getEdkRoutesCount success");
                    callback(rows, null);
                }
            });
    },

    getEdkAreasCount: function (editionId, callback) {
        let sqlQuery =  "SELECT count(1) as areasCount" +
        " from cantiga_areas ca" +
        " join cantiga_area_statuses cas" +
        " on ca.statusId = cas.id" +
        " join cantiga_projects cp" +
        " on cp.id = ca.projectId" +
        " where cas.isPublish = 1 AND cp.editionId=?";
        let values = [];

        if(editionId){
            values.push(editionId);
        }else {
            values.push(constants.defaultEditionId);
        }
        connection.query(sqlQuery, values,
            function (err, rows, field) {
                if (err) {
                    logger.error("getEdkAreasCount error: " + err);
                    callback(null, err);
                } else {
                    logger.info("getEdkAreasCount success");
                    callback(rows, null);
                }
            });
    },

    getEdkTerritoriesCount: function (editionId, callback) {
        let sqlQuery =  "SELECT count(1) as territoriesCount" +
            " from cantiga_territories ct" +
            " join cantiga_projects cp" +
            " on cp.id = ct.projectId" +
            " where cp.editionId=?";
        let values = [];

        if(editionId){
            values.push(editionId);
        }else {
            values.push(constants.defaultEditionId);
        }
        connection.query(sqlQuery, values,
            function (err, rows, field) {
                if (err) {
                    logger.error("getEdkTerritoriesCount error: " + err);
                    callback(null, err);
                } else {
                    logger.info("getEdkTerritoriesCount success");
                    callback(rows, null);
                }
            });
    },
    getEdkCountryCount: function(){
      return constants.countryCount;
    },
    waitForEdkRoutesCount:  async function (editionId, rows) {
        await new Promise((resolve, reject) => {
            this.getEdkRoutesCount(editionId,  (routesCount, err) => {
                if(err) {
                    reject();
                } else {
                    resolve();
                    rows[0].routesCount = routesCount[0].routesCount;
                }
            });
        });
    },
    waitForEdkAreasCount:  async function (editionId, rows) {
        await new Promise((resolve, reject) => {
            this.getEdkAreasCount(editionId,  (areasCount, err) => {
                if(err) {
                    reject();
                } else {
                    resolve();
                    rows[0].areasCount = areasCount[0].areasCount;
                }
            });
        });
    },
    waitForTerritoriesCount:  async function (editionId, rows) {
        await new Promise((resolve, reject) => {
            this.getEdkTerritoriesCount(editionId,  (territoryCount, err) => {
                if(err) {
                    reject();
                } else {
                    resolve();
                    rows[0].groupsCount = territoryCount[0].territoriesCount;
                }
            });
        });
    }

};
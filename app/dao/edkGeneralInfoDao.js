const connection = require('../../config/dbConnection');
const logger = require('../../config/logger');
const edkCountersDao = require('./edkCountersDao');
const edkRoutesDao = require('./edkRoutesDao');

module.exports = {

    getGeneralInfoVerification: function (callback) {
        connection.query("SELECT max(editionId) as currentYearId FROM admin_myapi.cantiga_projects",
            async function  (err, rows, field) {
                if (err) {
                    logger.error("getGeneralInfoVerification error: " + err);
                    callback(err);
                } else {
                    await edkCountersDao.waitForEdkAreasCount(rows[0].currentYearId, rows);
                    await edkCountersDao.waitForEdkRoutesCount(rows[0].currentYearId, rows);
                    await edkCountersDao.waitForTerritoriesCount(rows[0].currentYearId, rows);
                    await edkRoutesDao.waitForEdkRoutesLastUpdated(rows);
                    rows[0].countryCount = edkCountersDao.getEdkCountryCount();
                    logger.info("getGeneralInfoVerification success : " + rows);
                    callback(rows);
                }
            });
    }

};
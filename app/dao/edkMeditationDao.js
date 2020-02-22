const connection = require('../../config/dbConnection');
const logger = require('../../config/logger');

module.exports = {

    getMeditationList: function (callback) {
        var sqlQuery = "select" +
            " mp.id," +
            " mp.editionYear," +
            " mp.type, " +
            " ml.languageName," +
            " ml.languageCode," +
            " ml.title, " +
            " ml.id as meditationLanguageId, " +
            " ml.author, " +
            " ml.authorBio " +
            " from meditation_project as mp" +
            " left join meditation_languages ml" +
            " on(mp.id = ml.meditationProjectId)" ;

            function addNewMeditationEdition(row, parsedRows) {
                let meditations = [];
                meditations.push({
                    "languageName": row.languageName,
                    "languageCode": row.languageCode,
                    "title": row.title,
                    "id": row.meditationLanguageId,
                    "author": row.author,
                    "authorBio": row.authorBio,
                });


                parsedRows.push({
                    "id": row.id,
                    "year": row.editionYear,
                    "type": row.type,
                    "meditations": meditations
                });
            };

        connection.query(sqlQuery,
            function (err, rows, field) {
                if (err) {
                    logger.error("getEdkMeditationList error: " + err);
                    callback(err);
                } else {
                    logger.info("getEdkMeditationList success ");
                    let parsedRows = [];
                    rows.forEach(function (row) {
                        if (parsedRows.length === 0) {
                            addNewMeditationEdition(row, parsedRows);
                        } else  {
                            var isMeditationExist = false;
                            parsedRows.forEach(function (parsedRow) {
                                if(parsedRow.id == row.id) {
                                    parsedRow.meditations.push({
                                        "languageName": row.languageName,
                                        "languageCode": row.languageCode,
                                        "title": row.title,
                                        "id": row.meditationLanguageId,
                                        "author": row.author,
                                        "authorBio": row.authorBio,
                                    });
                                    isMeditationExist = true;
                                }
                            });
                            if(!isMeditationExist) {
                                addNewMeditationEdition(row, parsedRows);
                            }
                        }
                    });
                    callback(parsedRows);
                }
            });
    },   getMeditationById: function(meditationId, callback) {
        var sqlQuery = "select meditationId," +
            " title," +
            " id," +
            " author, " +
            " authorBio, " +
            " stationId," +
            " placeId, " +
            " audioFileUrl, " +
            " text" +
            " from meditation_station" +
            " where meditationId = ?";

        function addStation(row, parsedRows) {
            parsedRows[0].stations.push({
                "title": row.title,
                "id": row.id,
                "authorBio": row.authorBio,
                "stationId": row.stationId,
                "placeId": row.placeId,
                "audioFileUrl": row.audioFileUrl,
                "text": row.text,
            });
        };

        connection.query(sqlQuery,
            meditationId,function (err, rows, field) {
                if (err) {
                    logger.error("getMeditationById error: " + err);
                    callback(err);
                } else {
                    logger.info("getMeditationById success ");
                    let parsedRows = [];
                    rows.forEach(function (row) {
                        if (parsedRows.length === 0) {
                            parsedRows.push({"meditationId": row.meditationId, "stations": []});
                            logger.info('parsedRows ' + JSON.stringify(parsedRows));
                            addStation(row, parsedRows);
                        } else  {
                            addStation(row, parsedRows);
                        }
                    });
                    callback(parsedRows);
                }
            });
    },

};
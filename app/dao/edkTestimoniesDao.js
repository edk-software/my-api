var connection = require('../../config/dbConnection');
const logger = require('../../config/logger');

module.exports = {


    getEdkTestimonies: function(id, page, limit, callback) {
        var testimoniesCount=0;
        var countQuery = "select count(1) as testimoniesCount from cantiga_edk_testimonies";
        connection.query(countQuery,
             function (err, rows, field) {
                if (err) {
                    logger.error("getEdkTestimonies error: " +err);
                } else {
                    testimoniesCount = rows[0].testimoniesCount;
                    getPagedTestimonies(id, limit, testimoniesCount, page, callback);

                }
            });

    },
    getEdkRandomTestimonies: function(routeId, amount, callback) {

        var sqlQuery = " select * from cantiga_edk_testimonies t"
        var conditions = [];
        var values = [];

        if(routeId){
            sqlQuery = sqlQuery + " where t.route_id=?";
            values.push(routeId);
        }

        if(!amount){
            amount = 5;
        }
        sqlQuery = sqlQuery + (" ORDER BY RAND() LIMIT ?");
        values.push(Number(amount));
        connection.query(sqlQuery,
            values, function (err, rows, field) {
                if (err) {
                    logger.error("getEdkTestimonies error: " +err);
                    callback(err);
                } else {
                    logger.info("getEdkTestimonies success : " + rows);
                    callback(rows);
                }
            });
    }

};
function getLimit(limit) {
    var limitAsNumber = Number(limit);
    if(!limitAsNumber) {
        return 10;
    }
    return limitAsNumber;
}

function getStart(page, testimoniesCount, limit) {
  var pageAsNumber = Number(page);
  if(!pageAsNumber || pageAsNumber < 1) {
      return 0;
  }
  return (pageAsNumber - 1) * limit;
}


function getPagedTestimonies(id, limit, testimoniesCount, page, callback) {
    var sqlQuery = " select * from cantiga_edk_testimonies t";
    var values = [];
    if (id) {
        sqlQuery = sqlQuery + " where t.id=?";
        values.push(id);
    } else {
        sqlQuery = sqlQuery + " LIMIT ? , ?";
        var limitAsNumber = getLimit(limit);
        var start = getStart(page, testimoniesCount, limitAsNumber);
        values.push(Number(start));
        values.push(Number(limitAsNumber));
    }
    connection.query(sqlQuery,
        values, function (err, rows, field) {
            if (err) {
                logger.error("getPagedTestimonies error: " +err);
                callback(err);
            } else {
                logger.info("getPagedTestimonies success");
                callback(rows);
            }
        });
}
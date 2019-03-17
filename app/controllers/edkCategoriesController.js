var edkCategoriesDao = require('../dao/edkCategoriesDao');
var httpResponse = require('../util/httpUtil');

exports.getCategories = function(req, res) {
    edkCategoriesDao.getEdkCategories( function (result) {
        httpResponse.sendHttpResponse(result, res, "Categories not found","getCategories");
    });
};

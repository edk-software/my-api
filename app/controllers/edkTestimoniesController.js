var edkTestimoniesDao = require('../dao/edkTestimoniesDao');
var httpResponse = require('../util/httpUtil');

exports.getTestimonies = function(req, res) {
    edkTestimoniesDao.getEdkTestimonies(req.query.id, req.query.page,req.query.limit, function (result) {
        httpResponse.sendHttpResponse(result, res, "Testimonies for page " + req.query.page + " not found", "getTestimonies");
    });
};

exports.getRandomTestimonies = function(req, res) {
    edkTestimoniesDao.getEdkRandomTestimonies(req.query.routeId, req.query.amount, function (result) {
        httpResponse.sendHttpResponse(result, res, "Testimonies not found","getRandomTestimonies");
    });
};

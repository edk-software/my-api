var edkPromptDao = require('../dao/edkPromptDao');
var httpResponse = require('../util/httpUtil');

exports.getPrompts = function(req, res) {
    edkPromptDao.getEdkPrompts(req.query.email, function (result) {
        httpResponse.sendHttpResponse(result, res, "Prompts for email " + req.query.email + " not found","getPrompts");
    });
};

exports.getPromptsDetail = function(req, res) {
    edkPromptDao.getEdkPromptsDetail(req.query.email, function (result) {
        httpResponse.sendHttpResponse(result, res, "Prompts detail for email " + req.query.email + " not found","getPromptsDetail");
    });
};

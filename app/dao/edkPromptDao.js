var connection = require('../../config/dbConnection');
const logger = require('../../config/logger')

module.exports = {


    getEdkPrompts: function(email, callback) {
        var sqlQuery = "select  pr.id, pr.title, pr.image_path, pr.short_content from"
            + " cantiga_edk_user_category uc"
            + " join cantiga_users us"
            + " on(us.id=uc.user_id)"
            + " right join cantiga_edk_categories cat"
            + " on (cat.id = uc.category_id)"
            + " join cantiga_edk_prompts pr"
            + " on(pr.category_id=cat.id)"
            + " where (email=? OR cat.id=1)";
        connection.query(sqlQuery,
            [email], function (err, rows, field) {
                if (err) {
                    logger.error("getEdkPrompts error : " + err);
                    callback(err);
                } else {
                    logger.info("getEdkPrompts success : " + rows);
                    callback(rows);
                }
            });
    },
    getEdkPromptsDetail: function(email, callback) {
        var sqlQuery = "select  pr.id,pr.title,pr.image_path,pr.short_content,prd.full_content "
            + "from  cantiga_edk_user_category uc"
            + " join cantiga_users us"
            + " on(us.id=uc.user_id)"
            + " right join cantiga_edk_categories cat"
            + " on (cat.id = uc.category_id)"
            + " join cantiga_edk_prompts pr"
            + " on(pr.category_id=cat.id)"
            + " join cantiga_edk_prompts_detail prd"
            + " on(pr.id = prd.prompt_id)"
            + " where (email=? OR cat.id=1)";

        connection.query(sqlQuery,
            [email], function (err, rows, field) {
                if (err) {
                    logger.error("getEdkPromptsDetail error : " + err);
                    callback(err);
                } else {
                    logger.info("getEdkPromptsDetail success");
                    callback(rows);
                }
            });
    }

};

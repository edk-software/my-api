module.exports = {
    addOrderByCondition: function(orderByConditions, condition, value)  {
        if(value) {
            if(orderByConditions.length == 0) {
                orderByConditions.push(condition + " " + (value.toUpperCase() == 'ASC' ? 'ASC' : 'DESC'));
            } else {
                orderByConditions.push(", " + condition + " " + (value.toUpperCase() == 'ASC' ? 'ASC' : 'DESC'));
            }
        }
    }
}
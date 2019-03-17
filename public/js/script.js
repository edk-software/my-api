var edkRoutesController = require('../app/controllers/edkRoutesController')
//you can include all your controllers

module.exports = function (app, passport) {


    app.get('/', edkRoutesController.getRoutes);//home
    app.get('/home', edkRoutesController.getRoutes);//home



}

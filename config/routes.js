var edkRoutesController = require('../app/controllers/edkRoutesController');
var edkAreasController = require('../app/controllers/edkAreasController');
var edkRegistrationsController = require('../app/controllers/edkRegistrationsController');
var edkTerritoryController = require('../app/controllers/edkTerritoryController');
var edkRegistrationSettingsController = require('../app/controllers/edkRegistrationSettingsController');
var edkReflectionsController = require('../app/controllers/edkReflectionsController');
var edkLanguageController = require('../app/controllers/edkLanguageController');
var edkTestimoniesController = require('../app/controllers/edkTestimoniesController');
var edkPromptController = require('../app/controllers/edkPromptController');
var edkCategoriesController = require('../app/controllers/edkCategoriesController');
var edkProjectController = require('../app/controllers/edkProjectController');
var edkSearchController = require('../app/controllers/edkSearchController');
var edkCountersController = require('../app/controllers/edkCountersController');

module.exports = function (app) {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://www.edk.org.pl/");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.removeHeader("X-Powered-By");
        next();
    });
    app.get('/routes', edkRoutesController.getRoutes);
    app.get('/areas', edkAreasController.getAreas);
    app.get('/areasDetail/:id', edkAreasController.getAreasDetail);
    app.get('/routeByArea', edkRoutesController.getRoutesByArea);
    app.get('/routeByTerritory', edkRoutesController.getRoutesByTeritory);
    app.get('/registrations/:id', edkRegistrationsController.getRegistrations);
    app.get('/areaList', edkAreasController.getAreaList);
    app.get('/routeList', edkRoutesController.getRouteList);
    app.get('/territoryList', edkTerritoryController.getTerritoryList);
    app.get('/registrationSettings', edkRegistrationSettingsController.getRegistrationSettings);
    app.get('/areasByTerritory', edkAreasController.getAreasByTerritory);
    app.get('/reflections', edkReflectionsController.getReflections);
    app.get('/languages', edkLanguageController.getLanguage);
    app.get('/testimonies', edkTestimoniesController.getTestimonies);
    app.get('/randomTestimonies', edkTestimoniesController.getRandomTestimonies);
    app.get('/prompts', edkPromptController.getPrompts);
    app.get('/promptsDetail', edkPromptController.getPromptsDetail);
    app.get('/categories', edkCategoriesController.getCategories);
    app.get('/projects', edkProjectController.getProjects);
    app.get('/routeAmount', edkRoutesController.getRouteAmount);
    app.get('/areaAmount', edkAreasController.getAreaAmount);
    app.get('/counters/country', edkCountersController.getCountryCount);
    app.get('/counters/usersRegistration', edkCountersController.getUsersRegistrationCount);
    app.get('/counters/routes', edkCountersController.getRoutesCount);
    app.get('/counters/areas', edkCountersController.getAreasCount);
    app.get('/counters/territories', edkCountersController.getTerritoriesCount);
    app.get('/searchByString',  edkSearchController.getSearch);
}
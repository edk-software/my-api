var edkRoutesController = require('../app/controllers/edkRoutesController');
var edkAreasController = require('../app/controllers/edkAreasController');
var edkTerritoryController = require('../app/controllers/edkTerritoryController');
var edkProjectController = require('../app/controllers/edkProjectController');
var edkSearchController = require('../app/controllers/edkSearchController');
var edkCountersController = require('../app/controllers/edkCountersController');
var edkGeneralInfoController = require('../app/controllers/edkGeneralInfoController');
var edkMeditationController = require('../app/controllers/edkMeditationController');

module.exports = function (app) {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://www.edk.org.pl/");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.removeHeader("X-Powered-By");
        next();
    });


    /**
     * @swagger
     * /routes:
     *  get:
     *    parameters:
     *      - in: query
     *        name: id
     *        type: integer
     *        description: get routes by id
     *      - in: query
     *        name: editionId
     *        type: integer
     *        description: get routes by edition id
     *    description: Use request to get  routes
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/routes', edkRoutesController.getRoutes);
    /**
     * @swagger
     * /areas:
     *  get:
     *    parameters:
     *      - in: query
     *        name: territoryId
     *        type: integer
     *        description: get area by territoryId
     *      - in: query
     *        name: editionId
     *        type: integer
     *        description: get area by editionId
     *      - in: query
     *        name: eventDate
     *        type: integer
     *        description: get area event date
     *      - in: query
     *        name: orderByAreaName
     *        type: boolean
     *        description: order by areaName
     *      - in: query
     *        name: orderByTerritoryName
     *        type: integer
     *        description: order by orderByTerritoryName
     *      - in: query
     *        name: searchAreaName
     *        type: string
     *        description: get area by name
     *    description: Use request to get areas
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/areasList', edkAreasController.getAreas);
    /**
     * @swagger
     * /areasDetail:
     *  get:
     *    parameters:
     *      - in: query
     *        name: id
     *        type: integer
     *        description: get area by id
     *    description: Use request to get one detailed area using specific id
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/areasDetail', edkAreasController.getAreasDetail);

    /**
     * @swagger
     * /routeList:
     *  get:
     *    parameters:
     *      - in: query
     *        name: territoryId
     *        type: integer
     *        description: get route by territoryId
     *      - in: query
     *        name: editionId
     *        type: integer
     *        description: get route by editionId
     *      - in: query
     *        name: areaId
     *        type: integer
     *        description: get route by areaId
     *      - in: query
     *        name: eventDate
     *        type: integer
     *        description: get area event date
     *      - in: query
     *        name: orderByTerritoryName
     *        type: boolean
     *        description: order by orderByTerritoryName
     *      - in: query
     *        name: orderByRouteName
     *        type: boolean
     *        description: order by orderByRouteName
     *      - in: query
     *        name: orderByRouteLength
     *        type: boolean
     *        description: order by orderByRouteLength
     *      - in: query
     *        name: orderByEventDate
     *        type: boolean
     *        description: order by orderByEventDate
     *      - in: query
     *        name: searchByRouteName
     *        type: string
     *        description: get route using searchByRouteName
     *    description: Use request to get route
     *    responses:
     *      '200':
     *        description: A successful response
     */

    app.get('/routeList', edkRoutesController.getRouteList);

    /**
     * @swagger
     * /territoryList:
     *  get:
     *    parameters:
     *      - in: query
     *        name: editionId
     *        type: integer
     *        description: get territory by editionId
     *      - in: query
     *        name: eventDate
     *        type: integer
     *        description: get territory event date
     *      - in: query
     *        name: orderByTerritoryId
     *        type: boolean
     *        description: order by orderByTerritoryId
     *      - in: query
     *        name: orderByTerritoryName
     *        type: boolean
     *        description: order by orderByTerritoryName
     *      - in: query
     *        name: searchByTerritoryName
     *        type: string
     *        description: get territory by searchByTerritoryName
     *    description: Use request to get areas
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/territoryList', edkTerritoryController.getTerritoryList);
    app.get('/projects', edkProjectController.getProjects);
    app.get('/counters/country', edkCountersController.getCountryCount);
    app.get('/counters/usersRegistration', edkCountersController.getUsersRegistrationCount);
    app.get('/counters/routes', edkCountersController.getRoutesCount);
    app.get('/counters/areas', edkCountersController.getAreasCount);
    app.get('/counters/territories', edkCountersController.getTerritoriesCount);

    app.get('/routeDetail', edkRoutesController.getRouteDetail);

    /**
     * @swagger
     * /search:
     *  get:
     *    parameters:
     *      - in: query
     *        name: search
     *        type: string
     *        description: get areas, routes and territories by given input
     *      - in: query
     *        name: territoryId
     *        type: integer
     *        description: get areas, routes and territories by territoryId
     *      - in: query
     *        name: editionId
     *        type: integer
     *        description: get areas, routes and territories by editionId
     *      - in: query
     *        name: areaId
     *        type: integer
     *        description: get areas, routes and territories by areaId
     *      - in: query
     *        name: eventDate
     *        type: integer
     *        description: get areas, routes and territories by eventDate
     *    description: Use request to get areas, routes and territories
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/search', edkSearchController.getSearch);

    app.get('/areaDetail',  edkAreasController.getAreaDetail);
    /**
     * @swagger
     * /edkDates:
     *  get:
     *    parameters:
     *      - in: query
     *        name: projectId
     *        type: string
     *        description: get edk dates by projectId
     *    description: Use request to edk dates
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/edkDates',  edkAreasController.getEdkDates);

    app.get('/routeList/mobile', edkRoutesController.getRouteListForMobile);
    app.get('/mobile/verificationData',  edkGeneralInfoController.getGeneralInfoVerification);
    app.get('/mobile/allGeneralInfo',  edkGeneralInfoController.getEdkAllGeneralInfo);
    app.get('/mobile/routePoints', edkRoutesController.getRoutePoints);
    app.get('/mobile/routeList/byUser', edkRoutesController.getRoutesByUserId);
    app.get('/mobile/meditationList', edkMeditationController.getEdkMedidationList);
    app.get('/mobile/meditationById', edkMeditationController.getEdkMeditationById);
}
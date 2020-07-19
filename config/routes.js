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
     * /areasList:
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
     *      - in: query
     *        name: orderByName
     *        type: boolean
     *        description: get areas, routes and territories by orderByName
     *    description: Use request to get areas, routes and territories
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/search', edkSearchController.getSearch);
    /**
     * @swagger
     * /areaDetail:
     *  get:
     *    parameters:
     *      - in: query
     *        name: id
     *        type: integer
     *        description: get edk area details  by id
     *    description: Use request to get specific edk area details
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/areaDetail',  edkAreasController.getAreaDetail);
    /**
     * @swagger
     * /edkDates:
     *  get:
     *    parameters:
     *      - in: query
     *        name: projectId
     *        type: integer
     *        description: get edk dates by projectId
     *    description: Use request to edk dates
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/edkDates',  edkAreasController.getEdkDates);
    /**
     * @swagger
     * /routeList/mobile:
     *  get:
     *    description: Use request to get routes for mobile
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/routeList/mobile', edkRoutesController.getRouteListForMobile);
    /**
     * @swagger
     * /mobile/verificationData:
     *  get:
     *    parameters:
     *      - in: query
     *        name: editionId
     *        type: integer
     *        description: get edk statistics for edition Id
     *    description: Use request to get edk statistics
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/mobile/verificationData',  edkGeneralInfoController.getGeneralInfoVerification);
    /**
     * @swagger
     * /mobile/allGeneralInfo:
     *  get:
     *    parameters:
     *      - in: query
     *        name: editionId
     *        type: integer
     *        description: get edk general info  for edition Id
     *    description: Use request to get edk general info like statistics, territory with associated areas and routes
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/mobile/allGeneralInfo',  edkGeneralInfoController.getEdkAllGeneralInfo);
    /**
     * @swagger
     * /mobile/routePoints:
     *  get:
     *    parameters:
     *      - in: query
     *        name: id
     *        type: integer
     *        description: get edk characteristic route points by route id
     *    description: Use request to get edk characteristic geographic route points
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/mobile/routePoints', edkRoutesController.getRoutePoints);
    /**
     * @swagger
     * /mobile/routeList/byUser:
     *  get:
     *    parameters:
     *      - in: query
     *        name: userId
     *        type: integer
     *        description: get edk routes for given userId
     *    description: Use request to get edk all routes id for specific user
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/mobile/routeList/byUser', edkRoutesController.getRoutesByUserId);
    /**
     * @swagger
     * /mobile/meditationList:
     *  get:
     *    parameters:
     *    description: Use request to get edk all meditations
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/mobile/meditationList', edkMeditationController.getEdkMedidationList);
    /**
     * @swagger
     * /mobile/meditationById:
     *  get:
     *    parameters:
     *      - in: query
     *        name: meditationId
     *        type: integer
     *        description: get edk meditation by meditation id
     *    description: Use request to get specific meditation
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/mobile/meditationById', edkMeditationController.getEdkMeditationById);
}
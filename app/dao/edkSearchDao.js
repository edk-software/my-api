const connection = require('../../config/dbConnection');
const logger = require('../../config/logger');

const edkAreasDao = require('./edkAreasDao')
const edkRoutesDao = require('./edkRoutesDao');
const edkTerritoryDao = require('./edkTerritoryDao');

module.exports = {
    getEdkSearch: async function (territoryId, editionId, areaId, eventDate, orderByName,  textSearch, callback) {
        let routes = await waitForSearchByRoutes(territoryId, editionId, areaId, eventDate, textSearch);
        let areas = await waitForSearchByAreas(territoryId, editionId, eventDate, textSearch);
        let territories = await waitForSearchByByTerritory(editionId, eventDate, orderByName, textSearch);
        callback([...routes, ...areas, ...territories]);
    }
}

async function waitForSearchByRoutes(territoryId, editionId, areaId, eventDate, orderByName,  textSearch) {
    let routes = await new Promise((resolve, reject) => {
        edkRoutesDao.getEdkRouteList(territoryId, editionId, areaId, eventDate, null, orderByName, null, null, textSearch, handlePromise(reject, resolve));
    });
    return mapResult(routes, (routes) => routes
        .map(route => {
            return {
                name: route.routeName,
                type: 'route',
                details: {
                    areaName: route.areaName,
                    territoryName: route.territoryName,
                    lent: route.routeLength
                }
            }
        }))
}

async function waitForSearchByByTerritory(editionId, eventDate, orderByName, textSearch) {
    let territories = await new Promise((resolve, reject) => {
        edkTerritoryDao.getEdkTerritoryList(editionId, eventDate, null, orderByName, textSearch, handlePromise(reject, resolve));
    });
    return mapResult(territories, (territories) => territories)
        .map(territory => {
            return {
                name: territory.name,
                type: "territory",
                details: {areaCount: territory.areasCount, routesCount: territory.routesCount}

            }
        });
}

async function waitForSearchByAreas(territoryId, editionId, eventDate, textSearch) {
    let areas = await new Promise((resolve, reject) => {
        edkAreasDao.getEdkAreas(territoryId, editionId, eventDate, orderByName, null, null, textSearch, handlePromise(reject, resolve));
    });
    return mapResult(areas, (areas) => areas
        .map(area => {
            return {
                name: area.areaName,
                type: "area",
                details: {routesCount: area.routesCount, territoryName: area.territoryName}
            }
        }));
}

function handlePromise(reject, resolve) {
    return (result, err) => {
        if (err) {
            reject();
        } else {
            resolve(result);
        }
    };
}

function mapResult(result, mapResult) {
    if (result !== null && Array.isArray(result)) {
        return mapResult(result);
    }
    return [];
}
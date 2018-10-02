var mapDao = require('../dao/MapDao');

var MapService = {
    createMap: (map) => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await mapDao.createMap(map);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findAllMaps: () => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await mapDao.findAllMaps();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findMapById: (mapId) => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await mapDao.findMapById(mapId);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    }
};

module.exports = MapService;

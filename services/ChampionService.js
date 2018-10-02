var championDao = require('../dao/ChampionDao');

var ChampionService = {
    createChampion: (champion) => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await championDao.createChampion(champion);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findAllChampions: () => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await championDao.findAllChampions();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findChampionById: (championId) => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await championDao.findChampionById(championId);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findChampionByKey: (championKey) => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await championDao.findChampionByKey(championKey);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    }
};

module.exports = ChampionService;

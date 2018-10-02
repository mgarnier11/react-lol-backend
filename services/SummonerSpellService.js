var summonerSpellDao = require('../dao/SummonerSpellDao');

var SummonerSpellService = {
    createSummonerSpell: (summonerSpell) => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await summonerSpellDao.createSummonerSpell(summonerSpell);
                resolve(result);
                if (callback) callback(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findAllSummonerSpells: () => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await summonerSpellDao.findAllSummonerSpells();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findSummonerSpellById: (summonerSpellId) => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await summonerSpellDao.findSummonerSpellById(summonerSpellId);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    }
};

module.exports = SummonerSpellService;

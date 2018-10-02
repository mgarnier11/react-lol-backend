var runeDao = require('../dao/RuneDao');

var RuneService = {
    createRune: (rune) => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await runeDao.createRune(rune);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findAllRunes: () => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await runeDao.findAllRunes();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findRuneById: (runeId) => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await runeDao.findRuneById(runeId);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    }
};

module.exports = RuneService;

var summonerDao = require('../dao/SummonerDao');

var MasterieService = {
    findMasteries: (summonerId) => {
        return new Promise(async (resolve, reject) => {
            try {
                var masteries = await getAllMasteries(summonerId);

                resolve(masteries);
            } catch (error) {
                reject(error);
            }
        })
    },

    findMasterie: (summonerId, championId) => {
        return new Promise(async (resolve, reject) => {
            try {
                var masteries = await getAllMasteries(summonerId);
                resolve(masteries.find(masterie => {
                    return masterie.championId = championId;
                }));
            } catch (error) {
                reject(error);
            }
        })
    }
}

async function getAllMasteries(summonerId) {
    return new Promise(async resolve => {
        var summoner = await summonerDao.findSummonerById(summonerId);
        if (!summoner) summoner = await kayn.Summoner.by.id(summonerId);
        var dateToday = new Date();
        if (summoner.masteries && summoner.masteriesDate) {
            var timeDiff = Math.abs(dateToday.getTime() - summoner.masteriesDate.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (diffDays > 1) {
                summoner.masteries = await kayn.ChampionMastery.list(summonerId)
                summoner.masteriesDate = dateToday;
                summonerDao.upsertSummoner(summoner);
            }
        } else {
            summoner.masteries = await kayn.ChampionMastery.list(summonerId)
            summoner.masteriesDate = dateToday;
            summonerDao.upsertSummoner(summoner);
        }

        resolve(summoner.masteries);
    })
}

module.exports = MasterieService;

var matchDao = require('../dao/MatchDao');

var MatchService = {
    createMatch: (match) => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await matchDao.createMatch(match);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findAllMatchs: () => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await matchDao.findAllMatchs();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findMatchById: (matchId) => {

        return new Promise(async (resolve, reject) => {
            try {
                var result = await matchDao.findMatchById(matchId);
                if (!result) {
                    result = await kayn.Match.get(matchId);
                    matchDao.upsertMatch(result);
                }

                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findActiveMatch: (summonerId) => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await kayn.CurrentGame.by.summonerID(summonerId);
                if (result) {
                    result.participants.forEach((participant, index) => {
                        participant.bannedChampion = result.bannedChampions[index];
                    });
                }
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findSummonerMatchList: (accountId, query) => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await kayn.Matchlist.by.accountID(accountId).query(query);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    },

    getRecentGames: () => {

        return new Promise(async (resolve, reject) => {
            try {
                var result = await kayn.FeaturedGames.list();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }
};

module.exports = MatchService;

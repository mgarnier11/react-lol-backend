var matchService = require('./MatchService');

var summonerDao = require('../dao/SummonerDao');

var leagueQueuesArray = Object.values(config.leagueQueuesId);

var SummonerService = {
    createSummoner: (summoner) => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await summonerDao.createSummoner(summoner);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findAllSummoners: () => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await summonerDao.findAllSummoners();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findSummonerById: (summonerId) => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await summonerDao.findSummonerById(summonerId);
                if (!result) {
                    result = await kayn.Summoner.by.id(summonerId);
                    summonerDao.upsertSummoner(result);
                }
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findSummonerByName: (summonerName) => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await summonerDao.findSummonerByName(summonerName);
                if (!result) {
                    result = await kayn.Summoner.by.name(summonerName);
                    summonerDao.upsertSummoner(result);
                }
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findSummonerStatsInMatches: (summonerId, matchList) => {
        return new Promise(async (resolve, reject) => {
            var matchDatas = [];
            var stats = {};

            console.log('getting ' + matchList.length + ' matches');
            var i = 0;
            for (var match of matchList) {
                var matchData = await matchService.findMatchById(match.gameId);
                console.log('match ' + i++ + '/' + matchList.length);
                if (matchData) matchDatas.push(matchData);
            }

            stats.kda = calculateKda(matchDatas, summonerId);
            stats.winRate = calculateWinRate(matchDatas, summonerId);
            stats.nbGames = matchDatas.length;

            resolve({ stats, matchDatas });
        });
    },

    getSummonerRanks: (summonerId) => {
        return new Promise(async (resolve, reject) => {
            try {
                var summoner = await summonerDao.findSummonerById(summonerId);
                if (!summoner) summoner = await kayn.Summoner.by.id(summonerId);
                var dateToday = new Date();
                if (summoner.ranks && summoner.ranksDate) {
                    var timeDiff = Math.abs(dateToday.getTime() - summoner.ranksDate.getTime());
                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    if (diffDays > 1) {
                        summoner.ranks = await kayn.LeaguePositions.by.summonerID(summonerId);
                        summoner.ranksDate = dateToday;
                        summonerDao.upsertSummoner(summoner);
                    }
                } else {
                    summoner.ranks = await kayn.LeaguePositions.by.summonerID(summonerId);
                    summoner.ranksDate = dateToday;
                    summonerDao.upsertSummoner(summoner);
                }
                resolve(summoner.ranks);
            } catch (error) {
                reject(error);
            }
        })
    },
    calculateKda: (games, summonerId) => {
        return calculateKda(games, summonerId);
    },

    calculateWinRate: (games, summonerId) => {
        return calculateWinRate(games, summonerId);
    }
};

module.exports = SummonerService;

function calculateWinRate(games, summonerId) {
    var totalGames = games.length;
    var wins = 0;
    games.forEach((game) => {
        var participantIdentitie = game.participantIdentities.find((participantIdentitie) => {
            if (participantIdentitie.player) return participantIdentitie.player.summonerId == summonerId;
            else return null;
        })
        if (participantIdentitie) {
            var stats = game.participants[participantIdentitie.participantId - 1].stats;

            if (stats.win) wins++;
        }
    });

    return (wins / totalGames) * 100;
}

function calculateKda(games, summonerId) {
    var totalGames = games.length;

    var kills = 0;
    var deaths = 0;
    var assists = 0;

    games.forEach((game) => {
        var participantIdentitie = game.participantIdentities.find((participantIdentitie) => {
            if (participantIdentitie.player) return participantIdentitie.player.summonerId == summonerId;
            else return null;
        })
        if (participantIdentitie) {
            var stats = game.participants[participantIdentitie.participantId - 1].stats;

            kills += stats.kills;
            deaths += stats.deaths;
            assists += stats.assists;
        }
    });

    return (kills / totalGames).toFixed(1) + ' / ' + (deaths / totalGames).toFixed(1) + ' / ' + (assists / totalGames).toFixed(1);
}
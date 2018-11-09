var summonerService = require('../services/SummonerService');
var championService = require('../services/ChampionService');
var queueService = require('../services/QueueService');
var summonerSpellService = require('../services/SummonerSpellService');
var runeService = require('../services/RuneService');
var masterieService = require('../services/MasterieService');
var matchService = require('../services/MatchService');

var toArabic = require('roman-numerals').toArabic;


function SummonerSocketController(socket) {
    socket.on('getSummonerById', async (summonerId) => {
        try {
            var summoner = await summonerService.findSummonerById(summonerId);
            socket.emit('returnSummoner', summoner);
        } catch (error) {
            error = JSON.parse(error.error.error);
            socket.emit('returnError', { code: error.status.status_code, type: 'Summoner', message: error.status.message });
        }
    });

    socket.on('getSummonerByName', async (summonerName) => {
        try {
            var summoner = await summonerService.findSummonerByName(summonerName);
            socket.emit('returnSummoner', summoner);
        } catch (error) {
            error = JSON.parse(error.error.error);
            socket.emit('returnError', { code: error.status.status_code, type: 'Summoner', message: error.status.message });
        }
    });

    socket.on('getSummonerStatsById', async (summonerId) => {
        try {
            var summoner = await summonerService.findSummonerById(summonerId);
            if (socket.summoners.length > 0) socket.summoners.push(summoner);
            else {
                socket.summoners.push(summoner);
                getStats({
                    endIndex: config.nbGames,
                    season: config.leagueSeasonId,
                });
            }
        } catch (error) {
            console.log(error);
        }

    });

    socket.on('getSummonerStatsByName', async (summonerName) => {
        try {
            var summoner = await summonerService.findSummonerByName(summonerName);
            if (socket.summoners.length > 0) socket.summoners.push(summoner);
            else {
                socket.summoners.push(summoner);
                getStats({
                    endIndex: config.nbGames,
                    season: config.leagueSeasonId,
                });
            }
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('getSummonerStatsByIdChampionId', async (data) => {
        var summonerId = data.summonerId;
        var championId = data.championId;

        try {
            var summoner = await summonerService.findSummonerById(summonerId);

            summoner.championId = championId;

            if (socket.summoners.length > 0) socket.summoners.push(summoner);
            else {
                socket.summoners.push(summoner);
                getStats({
                    endIndex: config.nbGames,
                    season: config.leagueSeasonId,
                    champion: championId
                });
            }
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('getParticipant', async (participant) => {
        participant.champion = await championService.findChampionById(participant.championId);

        if (participant.bannedChampion) {
            participant.bannedChampion = await championService.findChampionById(participant.bannedChampion.championId)
        }

        participant.perks.spells = [];
        participant.perks.spells.push(await summonerSpellService.findSummonerSpellById(participant.spell1Id));
        participant.perks.spells.push(await summonerSpellService.findSummonerSpellById(participant.spell2Id));

        participant.perks.majorRune = await runeService.findRuneById(participant.perks.perkIds[0]);

        socket.emit('returnParticipant', participant);

        var masteries = await masterieService.findMasteries(participant.summonerId);

        var newChampions = champions.map((champion) => {
            return { ...champion, masterie: masteries.find((masterie) => { return masterie.championId === parseInt(champion.key) }) }
        })
        newChampions.sort((a, b) => {
            return (b.masterie ? b.masterie.championPoints : 0) - (a.masterie ? a.masterie.championPoints : 0);
        });

        participant.bestChampions = newChampions.slice(0, 5);
        participant.champion = newChampions.find(champion => { return parseInt(champion.key) === participant.championId });

        socket.emit('returnParticipant', participant);
    });

    socket.on('getRanks', async (participant) => {
        try {
            var ranks = await summonerService.getSummonerRanks(participant.summonerId);

            participant.queues = await queueService.findMainQueues();
            participant.queues.forEach((queue, i) => {
                participant.queues[i].rank = ranks.find(rank => {
                    return rank.queueType == queue.queueType;
                });

                if (participant.queues[i].rank) {
                    var rank = participant.queues[i].rank;
                    var point = config.tiers[rank.tier] + (100 * (5 - toArabic(rank.rank))) + rank.leaguePoints;
                    var coef = (rank.wins - rank.losses) * (rank.wins / (rank.wins + rank.losses)) / 100 + 1;
                    participant.queues[i].rank.score = parseInt(point * coef);
                }
            });

            socket.emit('returnParticipant', participant);
        } catch (error) {
            console.log(error);
        }

    });

    socket.on('resetSummoners', () => {
        socket.summoners = [];
    })

    async function getStats(query) {
        var allMatches = [];
        console.log(socket.summoners.length + ' summoners remaining');
        if (socket.summoners.length > 0) {
            var summoner = socket.summoners[0];
            console.log('getting stats for ' + summoner.id);
            var percent = 0;
            for (var queue of config.mainQueues) {
                query.queue = queue.id;
                query.champion = summoner.championId;
                try {
                    matchList = await summonerService.findMatchList(summoner.id, query);
                    //matchList = await matchService.findSummonerMatchList(summoner.accountId, query);

                    if (matchList.matches.length > 0) {
                        var data = await summonerService.findSummonerStatsInMatches(summoner.id, matchList.matches)
                            .progress(tmp => {
                                percent = config.mainQueues.indexOf(queue) * 33 + tmp * 33 / 100;
                                socket.emit('returnSummonerLoading', { summonerId: summoner.id, loading: percent });
                            })

                        //var data = await summonerService.findSummonerStatsInMatches(summoner.id, matchList.matches);
                        summoner[queue.id] = data.stats;
                        summoner[queue.id].matchList = matchList.matches;
                        allMatches.push.apply(allMatches, data.matchDatas);
                    }
                } catch (error) {
                    console.log(error);
                }
                percent = config.mainQueues.indexOf(queue) * 33;
                socket.emit('returnSummonerLoading', { summonerId: summoner.id, loading: percent });


            }

            summoner.kda = summonerService.calculateKda(allMatches, summoner.id);
            summoner.winRate = summonerService.calculateWinRate(allMatches, summoner.id);
            summoner.nbGames = allMatches.length;

            socket.emit('returnSummonerStats', summoner);

            socket.summoners.shift();
            getStats(query);
        }
    }
};

module.exports = SummonerSocketController;
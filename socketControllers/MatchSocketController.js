var matchService = require('../services/MatchService');
var queueService = require('../services/QueueService');
var mapService = require('../services/MapService');
var summonerService = require('../services/SummonerService');

function MatchSocketController(socket) {
    socket.on('getActiveMatch', async (summonerId) => {
        socket.summoners = [];
        try {
            var match = await matchService.findActiveMatch(summonerId);

            socket.emit('returnActiveMatch', match);

            match.map = await mapService.findMapById(match.mapId);
            match.queue = await queueService.findQueueById(match.gameQueueConfigId);

            socket.emit('returnMatch', match);
        } catch (error) {
            error = JSON.parse(error.error.error);
            socket.emit('returnError', { code: error.status.status_code, type: 'Match', message: error.status.message });
        }
    });

    socket.on('getRecentGames', async () => {
        try {
            var matchList = await matchService.getRecentGames();

            socket.emit('returnRecentGames', matchList.gameList);
            if (matchList.gameList) {
                matchList.gameList.forEach(async (match) => {
                    match.map = await mapService.findMapById(match.mapId);
                    match.queue = await queueService.findQueueById(match.gameQueueConfigId);

                    socket.emit('returnMatch', match);
                });
            }
        } catch (error) {
            error = JSON.parse(error.error.error);
            socket.emit('returnError', { code: error.status.status_code, type: 'Match', message: error.status.message });
        }
    })
};

module.exports = MatchSocketController;
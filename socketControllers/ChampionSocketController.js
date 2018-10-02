var championService = require('../services/ChampionService');

function ChampionSocketController(socket) {
    socket.on('getChampionById', async (championId) => {
        try {
            socket.emit('returnChampion', await championService.findChampionById(championId));
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('getChampionByName', async (championName) => {
        try {
            socket.emit('returnChampion', await championService.findChampionByKey(championName));
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('getAllChampions', async () => {
        try {
            socket.emit('returnChampions', await championService.findAllChampions());
        } catch (error) {
            console.log(error);
        }
    });
};

module.exports = ChampionSocketController;
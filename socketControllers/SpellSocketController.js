var summonerSpellService = require('../services/SummonerSpellService');

function SummonerSpellSocketController(socket) {
    socket.on('getSpellById', async (summonerSpellId) => {
        try {
            socket.emit('returnSpell', await summonerSpellService.findSummonerSpellById(summonerSpellId));
        } catch (error) {
            console.log(error)
        }

    });

    socket.on('getAllSpells', async () => {
        try {
            socket.emit('returnSpells', await summonerSpellService.findAllSummonerSpells());
        } catch (error) {
            console.log(error);
        }

    });
};

module.exports = SummonerSpellSocketController;
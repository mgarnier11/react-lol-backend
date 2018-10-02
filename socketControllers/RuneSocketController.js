var runeService = require('../services/RuneService');

function RuneSocketController(socket) {
    socket.on('getRuneById', async (runeId) => {
        try {
            socket.emit('returnRune', await runeService.findRuneById(runeId));
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('getAllRunes', async () => {
        try {
            socket.emit('returnRunes', await runeService.findAllRunes());
        } catch (error) {
            console.log(error);
        }
    });
};

module.exports = RuneSocketController;
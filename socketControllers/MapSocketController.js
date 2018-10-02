var mapService = require('../services/MapService');

function MapSocketController(socket) {
    socket.on('getMapById', async (mapId) => {
        try {
            socket.emit('returnMap', await mapService.findMapById(mapId));
        } catch (error) {
            console.log(error);
        }

    });

    socket.on('getAllMaps', async () => {
        try {
            socket.emit('returnMaps', await mapService.findAllMaps());
        } catch (error) {
            console.log(error);
        }
    });
};

module.exports = MapSocketController;
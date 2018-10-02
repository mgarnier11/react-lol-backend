var queueService = require('../services/QueueService');

function QueueSocketController(socket) {
    socket.on('getQueueById', async (queueId) => {
        try {
            socket.emit('returnQueue', await queueService.findQueueById(queueId));
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('getAllQueues', async () => {
        try {
            socket.emit('returnQueues', await queueService.findAllQueues());
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('getQueueList', async () => {
        try {
            socket.emit('returnQueues', await queueService.findMainQueues());
        } catch (error) {
            console.log(error);
        }
    });
};

module.exports = QueueSocketController;
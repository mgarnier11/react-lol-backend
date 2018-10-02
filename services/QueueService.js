var queueDao = require('../dao/QueueDao');
var leagueQueuesId = Object.values(config.leagueQueuesId);


var QueueService = {
    createQueue: (queue) => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await queueDao.createQueue(queue);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findAllQueues: () => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await queueDao.findAllQueues();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findQueueById: (queueId) => {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await queueDao.findQueueById(queueId);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    },

    findMainQueues: () => {
        return new Promise(async (resolve, reject) => {
            try {
                var queues = [];

                for (var queueId of leagueQueuesId) {
                    queues.push(await queueDao.findQueueById(queueId));
                }

                resolve(queues);
            } catch (error) {
                reject(error);
            }
        })
    }
};

module.exports = QueueService;

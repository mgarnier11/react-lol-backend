var QueueDao = {
    createQueue: (queue) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.queues).insertOne(queue, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    findAllQueues: () => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.queues).find({}).toArray((err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    findQueueById: (queueId) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.queues).findOne({ id: queueId }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    upsertQueue: (queue) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.queues).updateOne({ id: queue.id }, { $set: queue }, { upsert: true }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

module.exports = QueueDao
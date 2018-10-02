var MapDao = {
    createMap: (map) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.maps).insertOne(map, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    findAllMaps: () => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.maps).find({}).toArray((err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    findMapById: (mapId) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.maps).findOne({ id: mapId }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    upsertMap: (map) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.maps).updateOne({ id: map.id }, { $set: map }, { upsert: true }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

module.exports = MapDao
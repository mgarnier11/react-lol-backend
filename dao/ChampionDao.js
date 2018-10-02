var ChampionDao = {
    createChampion: (champion) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.champions).insertOne(champion, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    findAllChampions: () => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.champions).find({}).toArray((err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    findChampionById: (championId) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.champions).findOne({ key: championId }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    findChampionByKey: (championKey) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.champions).findOne({ id: championKey }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    upsertChampion: (champion) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.champions).updateOne({ id: champion.id }, { $set: champion }, { upsert: true }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

module.exports = ChampionDao
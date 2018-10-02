var SummonerDao = {
    createSummoner: (summoner) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.summoners).insertOne(summoner, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    findAllSummoners: () => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.summoners).find({}).toArray((err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    findSummonerById: (summonerId) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.summoners).findOne({ id: summonerId }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    findSummonerByName: (summonerName) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.summoners).findOne({ name: summonerName }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    upsertSummoner: (summoner) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.summoners).updateOne({ id: summoner.id }, { $set: summoner }, { upsert: true }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

module.exports = SummonerDao
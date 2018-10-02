var MatchDao = {
    createMatch: (match) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.matchs).insertOne(match, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    findAllMatchs: () => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.matchs).find({}).toArray((err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    findMatchById: (matchId) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.matchs).findOne({ gameId: matchId }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    upsertMatch: (match) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.matchs).updateOne({ gameId: match.gameId }, { $set: match }, { upsert: true }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

module.exports = MatchDao
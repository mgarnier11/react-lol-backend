var RuneDao = {
    createRune: (rune) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.runes).insertOne(rune, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    findAllRunes: () => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.runes).find({}).toArray((err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    findRuneById: (runeId) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.runes).findOne({ id: runeId }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    upsertRune: (rune) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.runes).updateOne({ id: rune.id }, { $set: rune }, { upsert: true }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

module.exports = RuneDao
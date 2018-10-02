var SummonerSpellDao = {
    createSummonerSpell: (summonerSpell) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.summonerSpells).insertOne(summonerSpell, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    findAllSummonerSpells: () => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.summonerSpells).find({}).toArray((err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    findSummonerSpellById: (summonerSpellId) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.summonerSpells).findOne({ id: summonerSpellId }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    upsertSummonerSpell: (summonerSpell) => {
        return new Promise((resolve, reject) => {
            db.collection(config.collections.summonerSpells).updateOne({ id: summonerSpell.id }, { $set: summonerSpell }, { upsert: true }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

module.exports = SummonerSpellDao
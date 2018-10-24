var request = require('request');
var syncRequest = require('sync-request');
var mkdirp = require('mkdirp');
var imageDownloader = require('image-downloader');
var fs = require('fs');
var cheerio = require('cheerio');


var championDao = require('./dao/ChampionDao');
var mapDao = require('./dao/MapDao');
var queueDao = require('./dao/QueueDao');
var summonerSpellDao = require('./dao/SummonerSpellDao');
var runeDao = require('./dao/RuneDao');

function downloadChecked(url, filename) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filename)) {
            imageDownloader.image({
                url: url,
                dest: filename
            }).then(() => {
                resolve(true);
            }).catch((err) => {
                console.log(url);
                console.log(filename);
                console.error(err);
                resolve(false);
            })
        } else {
            resolve(false);
        }
    })
}

function myForEach(array, callback, end) {
    function task(index) {
        if (index >= array.length) end();
        else {
            callback(array[index], index, array, () => {
                task(index + 1);
            });
        }
    }

    task(0);
}

function asyncForEach(array, callback) {
    return new Promise(resolve => {
        for (let index = 0; index < array.length; index++) {
            callback(array[index], index, array)
        }
        resolve();
    });
}

function createDirs(championId) {
    mkdirp('public/champion/' + championId + '/images/loadings', (err, made) => {
        if (err)
            throw err;
        else
            if (made) console.log(championId + ' : loadings dir created');
    });

    mkdirp('public/champion/' + championId + '/images/splashes', (err, made) => {
        if (err)
            throw err;
        else
            if (made) console.log(championId + ' : splashes dir created');
    });
}

function loadChampions(callback) {
    return new Promise(async (resolve) => {
        var champions = await kayn.DDragon.Champion.listFull();

        var championList = Object.values(champions.data);

        myForEach(championList, async (champion, index, championList, next) => {
            champion.key = parseInt(champion.key);

            createDirs(champion.id);

            champion.skins.forEach((skin, i) => {
                champion.skins[i].loading = '/champion/' + champion.id + '/images/loadings/' + skin.num + '.jpg';
                champion.skins[i].splash = '/champion/' + champion.id + '/images/splashes/' + skin.num + '.jpg';
            })
            champion.icon = '/champion/' + champion.id + '/images/icon.jpg';

            try {
                var result = await championDao.upsertChampion(champion);
                if (result.upsertedCount > 0) console.log('Champion : ' + champion.id + ' inserted to database');
            } catch (error) {
                console.log(error);
            }

            await downloadChecked(config.ddUrl + config.championImagesConfig.icons + champion.id + '.png', 'public' + champion.icon);
            await asyncForEach(champion.skins, (skin) => {
                downloadChecked(config.realms.cdn + config.championImagesConfig.skinsLoading + champion.id + '_' + skin.num + '.jpg', 'public' + skin.loading);
                downloadChecked(config.realms.cdn + config.championImagesConfig.skinsSplash + champion.id + '_' + skin.num + '.jpg', 'public' + skin.splash);
            });
            console.log('Champion ' + (index + 1) + '/' + championList.length + ' done');

            next();
        }, () => {
            if (callback) callback();
            resolve('Champions done !');
        });
    })
}

function getQueues() {
    var html = syncRequest('GET', 'https://developer.riotgames.com/game-constants.html').getBody().toString();
    var $ = cheerio.load(html);
    var table = $('.span12 a[name=matchmaking-queues]').next().next().next();
    var keys = [];
    table.find('thead tr th').each((i, elem) => {
        keys.push($(elem).html().toLowerCase());
    });

    var queues = [];
    table.find('tbody tr').each((i, tr) => {
        var queue = {};
        $(tr).find('td').each((i, td) => {
            queue[keys[i]] = $(td).text();
        })
        queues.push(queue);
    });
    return queues;

}

function loadQueues(callback) {
    return new Promise((resolve) => {
        var queueList = getQueues();

        myForEach(queueList, async (queue, index, queueList, next) => {
            queue.id = parseInt(queue.id);
            if (queue.id == 420) {
                queue.named = 'Solo 5v5';
                queue.queueType = 'RANKED_SOLO_5x5';
            }
            if (queue.id == 440) {
                queue.named = 'Flex 5v5';
                queue.queueType = 'RANKED_FLEX_SR';
            }
            if (queue.id == 470) {
                queue.named = 'Flex 3v3';
                queue.queueType = 'RANKED_FLEX_TT';
            }

            try {
                var result = await queueDao.upsertQueue(queue);
                if (result.upsertedCount > 0) console.log('Queue : ' + queue.id + ' inserted to database');
            } catch (error) {
                console.log(error);
            }

            console.log('Queue ' + (index + 1) + '/' + queueList.length + ' done');

            next();
        }, () => {
            if (callback) callback();
            resolve('Queues done !');
        });
    });
}

function loadMaps(callback) {
    return new Promise((resolve) => {
        var maps = JSON.parse(syncRequest('GET', config.ddUrl + '/data/en_US/map.json').getBody()).data;

        var mapList = [];
        Object.keys(maps).forEach((key, index) => {
            maps[key].id = key;
            mapList.push(maps[key]);
        });

        myForEach(mapList, async (map, index, mapList, next) => {
            map.id = parseInt(map.id);

            try {
                var result = await mapDao.upsertMap(map);
                if (result.upsertedCount > 0) console.log('Map : ' + map.id + ' inserted to database');
            } catch (error) {
                console.log(error);
            }
            console.log('Map ' + (index + 1) + '/' + mapList.length + ' done');

            next();
        }, () => {
            if (callback) callback();
            resolve('Maps done !');
        });
    })
}

function loadSummonerSpells(callback) {
    return new Promise((resolve) => {
        var summonerSpells = JSON.parse(syncRequest('GET', config.ddUrl + '/data/en_US/summoner.json').getBody()).data;

        myForEach(Object.values(summonerSpells), async (summonerSpell, index, summonerSpellList, next) => {
            var tmp = summonerSpell.id;
            summonerSpell.id = parseInt(summonerSpell.key);
            summonerSpell.key = tmp;
            try {
                var result = await summonerSpellDao.upsertSummonerSpell(summonerSpell);
                if (result.upsertedCount > 0) console.log('SummonerSpell : ' + summonerSpell.id + ' inserted to database');
            } catch (error) {
                console.log(error);
            }
            console.log('SummonerSpell ' + (index + 1) + '/' + summonerSpellList.length + ' done');

            next();
        }, () => {
            if (callback) callback();
            resolve('SummonerSpells done !');
        });
    })
}

function loadRunes(callback) {
    return new Promise((resolve) => {
        var runeTrees = JSON.parse(syncRequest('GET', config.ddUrl + '/data/en_US/runesReforged.json').getBody());
        var runeList = [];

        runeTrees.forEach((tree) => {
            tree.slots.forEach((treeRunes) => {
                treeRunes.runes.forEach((rune) => {
                    runeList.push(rune);
                })
            })
        })

        myForEach(runeList, async (rune, index, runeList, next) => {
            rune.id = parseInt(rune.id);

            rune.shortDesc = rune.shortDesc.replace(/\<[^\\>]*\>/g, '');
            rune.longDesc = rune.longDesc.replace(/\<[^\\>]*\>/g, '');

            try {
                var result = await runeDao.upsertRune(rune);
                if (result.upsertedCount > 0) console.log('Rune : ' + rune.id + ' inserted to database');
            } catch (error) {
                console.log(error);
            }
            console.log('Rune ' + (index + 1) + '/' + runeList.length + ' done');

            next();
        }, () => {
            if (callback) callback();
            resolve('Runes done !');
        });
    })
}

function loadIcons(callback) {
    return new Promise(async (resolve) => {
        var icons = JSON.parse(syncRequest('GET', config.ddUrl + '/data/en_US/profileicon.json').getBody()).data;

        icons = Object.values(icons);

        mkdirp('public/summoners/icons/', (err, made) => {
            if (err)
                throw err;
            else
                if (made) console.log('Icons : dir created');
        });

        for (var i = 0; i <= icons.length; i = i + 7) {

            await Promise.all([
                (icons[i] ? downloadChecked(config.ddUrl + '/img/profileicon/' + icons[i].id + '.png', 'public/summoners/icons/' + icons[i].id + '.jpg') : null),
                (icons[i + 1] ? downloadChecked(config.ddUrl + '/img/profileicon/' + icons[i + 1].id + '.png', 'public/summoners/icons/' + icons[i + 1].id + '.jpg') : null),
                (icons[i + 2] ? downloadChecked(config.ddUrl + '/img/profileicon/' + icons[i + 2].id + '.png', 'public/summoners/icons/' + icons[i + 2].id + '.jpg') : null),
                (icons[i + 3] ? downloadChecked(config.ddUrl + '/img/profileicon/' + icons[i + 3].id + '.png', 'public/summoners/icons/' + icons[i + 3].id + '.jpg') : null),
                (icons[i + 4] ? downloadChecked(config.ddUrl + '/img/profileicon/' + icons[i + 4].id + '.png', 'public/summoners/icons/' + icons[i + 4].id + '.jpg') : null),
                (icons[i + 5] ? downloadChecked(config.ddUrl + '/img/profileicon/' + icons[i + 5].id + '.png', 'public/summoners/icons/' + icons[i + 5].id + '.jpg') : null),
                (icons[i + 6] ? downloadChecked(config.ddUrl + '/img/profileicon/' + icons[i + 6].id + '.png', 'public/summoners/icons/' + icons[i + 6].id + '.jpg') : null)
            ]).then(values => {
                values.forEach((value, j) => {
                    if (value) console.log('Icon ' + (i + j) + ' downloaded');
                })
                console.log('Icons ' + (i + 1) + '/' + icons.length + ' done');
            });
        }
        if (callback) callback();
        resolve('Icons done !');
    });
}

function startupDDragon(callback) {
    return new Promise(async (resolve) => {
        await Promise.all([
            loadChampions(),
            loadQueues(),
            loadMaps(),
            loadSummonerSpells(),
            loadRunes(),
            loadIcons()
        ]).then(values => {
            values.forEach(value => console.log(value));
        });

        if (callback) callback();
        resolve();
    });
}

module.exports = startupDDragon;

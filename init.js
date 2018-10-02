var syncRequest = require('sync-request');

var config = require('./config.js');

var { LRUCache, BasicJSCache, METHOD_NAMES, REGIONS } = require('kayn');

function init(region) {
    config.server = Object.values(config.servers).find(server => { return server.region == region });

    config.kaynConfig.region = config.server.region;

    var basicCache = new BasicJSCache();

    var lruCache = new LRUCache({
        max: 50000,
        dispose: (key, value) => { },
        length: (value, key) => 1,
    })

    config.kaynConfig.cacheOptions = {
        cache: lruCache,
        timeToLives: {
            useDefault: true,
            byMethod: {
                [METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_NAME]: 1000 * 60 * 60 * 24,
                [METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_ID]: 1000 * 60 * 60 * 24,
                [METHOD_NAMES.SPECTATOR.GET_CURRENT_GAME_INFO_BY_SUMMONER]: 1000 * 60 * 5,
                [METHOD_NAMES.LEAGUE.GET_ALL_LEAGUE_POSITIONS_FOR_SUMMONER]: 1000 * 60 * 30,
                [METHOD_NAMES.CHAMPION_MASTERY.GET_CHAMPION_MASTERY]: 1000 * 60 * 60 * 12,
                [METHOD_NAMES.CHAMPION_MASTERY.GET_ALL_CHAMPION_MASTERIES]: 1000 * 60 * 60 * 12,
                [METHOD_NAMES.MATCH.GET_MATCH]: 1000 * 60 * 60 * 24,
                [METHOD_NAMES.MATCH.GET_MATCHLIST]: 1000 * 60 * 30,
                [METHOD_NAMES.SPECTATOR.GET_FEATURED_GAMES]: 1000 * 60 * 15
            }
        }
    }

    config.realms = JSON.parse(syncRequest('GET', 'https://ddragon.leagueoflegends.com/realms/' + config.server.region + '.json').getBody());
    config.ddUrl = config.realms.cdn + '/' + config.realms.v;
    var teemoggVersion = JSON.parse(syncRequest('GET', 'https://mushroom.teemo.gg/latest.txt').getBody());
    config.teemoggUrl = 'https://mushroom.teemo.gg/' + teemoggVersion;
    config.dbName = config.dbName + '-' + config.server.region;

    global.config = config;
}

module.exports = init;
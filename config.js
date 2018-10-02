var config = {
    hostname: "localhost",
    frontEndPort: 80,
    servers: {
        BR: { region: 'br', port: 3001 },
        EUNE: { region: 'eune', port: 3002 },
        EUW: { region: 'euw', port: 3003 },
        KR: { region: 'kr', port: 3004 },
        LAN: { region: 'lan', port: 3005 },
        LAS: { region: 'las', port: 3006 },
        NA: { region: 'na', port: 3007 },
        OCE: { region: 'oce', port: 3008 },
        RU: { region: 'ru', port: 3009 },
        TR: { region: 'tr', port: 3010 },
        JP: { region: 'jp', port: 3011 },
    },
    tiers: {
        "BRONZE": 0,
        "SILVER": 500,
        "GOLD": 1000,
        "PLATINUM": 1500,
        "DIAMOND": 2000,
        "MASTER": 2100,
        "CHALLENGER": 2200
    },
    dbName: "react-lol-db",
    collections: {
        champions: "champions",
        queues: "queues",
        maps: "maps",
        summoners: "summoners",
        matchs: "games",
        summonerSpells: "summonerSpells",
        runes: "runes"
    },
    leagueSeasonId: 11,
    leagueQueuesId: {
        solo: 420,
        flex5v5: 440,
        flex3v3: 470
    },
    rankNames: [
        "RANKED_SOLO_5x5",
        "RANKED_FLEX_SR",
        "RANKED_FLEX_TT"
    ],
    nbGames: 10,
    championImagesConfig: {
        skinsLoading: '/img/champion/loading/',
        skinsSplash: '/img/champion/splash/',
        icons: '/img/champion/'
    },
    kaynConfig: {
        region: "euw",
        debugOptions: {
            isEnabled: true,
            showKey: false
        },
        requestOptions: {
            shouldRetry: true,
            numberOfRetriesBeforeAbort: 3,
            delayBeforeRetry: 1000,
            burst: false,
            shouldExitOn403: false
        }
    }
}

module.exports = config;
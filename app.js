var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var socketio = require('socket.io');
var MongoClient = require("mongodb").MongoClient;
var { Kayn } = require('kayn');
var configBase = require('./config.js');

var init = require('./init');
var startup = require('./startup');

console.time('startup');

init();

const key = (process.env.LEAGUE_API_KEY ? process.env.LEAGUE_API_KEY : '1234');

var kayn = Kayn(key)(config.kaynConfig);
global.kayn = kayn;

var championController = require('./controllers/ChampionController');
var mapController = require('./controllers/MapController');
var queueController = require('./controllers/QueueController');
var summonerController = require('./controllers/SummonerController');
var matchController = require('./controllers/MatchController');
var summonerSpellController = require('./controllers/SummonerSpellController');
var runeController = require('./controllers/RuneController');

var championSocketController = require('./socketControllers/ChampionSocketController');
var mapSocketController = require('./socketControllers/MapSocketController');
var matchSocketController = require('./socketControllers/MatchSocketController');
var queueSocketController = require('./socketControllers/QueueSocketController');
var runeSocketController = require('./socketControllers/RuneSocketController');
var spellSocketController = require('./socketControllers/SpellSocketController');
var summonerSocketController = require('./socketControllers/SummonerSocketController');
var teamSocketController = require('./socketControllers/TeamSocketController');

var championService = require('./services/ChampionService');



console.log('connecting to db...');
MongoClient.connect((process.env.DB ? process.env.DB : 'mongodb://localhost:27017'), { useNewUrlParser: true }, async (err, db) => {
    if (err) throw err;
    console.log('connected to db !');
    global.db = db.db(config.dbName);

    var app = express();

    app.use(cors({ credentials: true, origin: true }));
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, '../public')));

    app.use('/champion', championController);
    app.use('/map', mapController);
    app.use('/queue', queueController);
    app.use('/summoner', summonerController);
    app.use('/match', matchController);
    app.use('/summonerSpell', summonerSpellController);
    app.use('/rune', runeController);

    app.use('/', (req, res) => {
        res.send(config.region + ' backend is listenning');
    })

    var server = app.listen((process.env.PORT ? process.env.PORT : 80), (process.env.PORT ? '' : '127.0.0.2'), () => {
        console.timeEnd('startup');
        console.log(config.region + ' backend is listenning on port ' + process.env.PORT);
    });

    await startup();

    global.champions = await championService.findAllChampions();

    io = socketio.listen(server);

    io.on('connection', (socket) => {
        console.log('an user connected');

        socket.summoners = [];

        championSocketController(socket);
        mapSocketController(socket);
        matchSocketController(socket);
        queueSocketController(socket);
        runeSocketController(socket);
        spellSocketController(socket);
        summonerSocketController(socket);
        teamSocketController(socket);

        socket.on('disconnect', function () {
            socket.summoners = [];
        });
    });
});
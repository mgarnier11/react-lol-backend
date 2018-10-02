var router = require('express').Router();
var championService = require('../services/ChampionService');

/* GET all champions */
router.get('/list', async (req, res) => {
    try {
        res.send(await championService.findAllChampions());
    } catch (error) {
        console.log(error);
    }
});

/* GET a champion by his id : 84*/
router.get('/id/:championId', async (req, res) => {
    var championId = parseInt(req.params.championId);

    try {
        res.send(await championService.findChampionById(championId));
    } catch (error) {
        console.log(error);
    }
});

/* GET a champion by his Key : Akali */
router.get('/key/:championKey', async (req, res) => {
    var championKey = req.params.championKey;

    try {
        res.send(await championService.findChampionByKey(championKey));
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
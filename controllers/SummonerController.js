var router = require('express').Router();
var summonerService = require('../services/SummonerService');

router.get('/id/:summonerId', async (req, res) => {
    var summonerId = parseInt(req.params.summonerId);
    try {
        res.send(await summonerService.findSummonerById(summonerId));
    } catch (error) {
        console.log(error);
    }
});

router.get('/name/:summonerName', async (req, res) => {
    var summonerName = req.params.summonerName;
    try {
        res.send(await summonerService.findSummonerByName(summonerName));
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;
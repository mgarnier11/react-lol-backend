var router = require('express').Router();
var summonerSpellService = require('../services/SummonerSpellService');

/* GET all summonerSpells */
router.get('/list', async (req, res) => {
    try {
        res.send(await summonerSpellService.findAllSummonerSpells());
    } catch (error) {
        console.log(error);
    }
});

/* GET a summonerSpell by her Id : 11*/
router.get('/:summonerSpellId', async (req, res) => {
    var summonerSpellId = parseInt(req.params.summonerSpellId);
    try {
        res.send(await summonerSpellService.findSummonerSpellById(summonerSpellId));
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
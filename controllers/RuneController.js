var router = require('express').Router();
var runeService = require('../services/RuneService');

/* GET all runes */
router.get('/list', async (req, res) => {
    try {
        res.send(await runeService.findAllRunes());
    } catch (error) {
        console.log(error);
    }
});

/* GET a rune by her Id : 11*/
router.get('/:runeId', async (req, res) => {
    var runeId = parseInt(req.params.runeId);
    try {
        res.send(await runeService.findRuneById(runeId));
    } catch (error) {
        console.log(error);
    }
});



module.exports = router;
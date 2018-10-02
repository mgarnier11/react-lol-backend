var router = require('express').Router();
var matchService = require('../services/MatchService');

/* GET a match by her Id : 11*/
router.get('/:matchId', async (req, res) => {
    var matchId = parseInt(req.params.matchId);
    try {
        res.send(await matchService.findMatchById(matchId));
    } catch (error) {
        console.log(error);
    }
});
module.exports = router;
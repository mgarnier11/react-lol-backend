var router = require('express').Router();
var mapService = require('../services/MapService');

/* GET all maps */
router.get('/list', async (req, res) => {
    try {
        res.send(await mapService.findAllMaps());
    } catch (error) {
        console.log(error);
    }
});

/* GET a map by her Id : 11*/
router.get('/:mapId', async (req, res) => {
    var mapId = parseInt(req.params.mapId);
    try {
        res.send(await mapService.findMapById(mapId));
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
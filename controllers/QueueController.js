var router = require('express').Router();
var queueService = require('../services/QueueService');

/* GET all queues */
router.get('/list', async (req, res) => {
    try {
        res.send(await queueService.findAllQueues());
    } catch (error) {
        console.log(error)
    }
});

/* GET a queue by her Id : 11*/
router.get('/:queueId', async (req, res) => {
    var queueId = parseInt(req.params.queueId);
    try {
        res.send(await queueService.findQueueById(queueId));
    } catch (error) {
        console.log(error);
    }
});
module.exports = router;
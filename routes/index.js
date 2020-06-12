var express = require('express');
var router = express.Router();

const heroController = require('../controllers/heroes');
/* GET home page. */
router.get('/', heroController.landingPage);

router.get('/heroes', heroController.getHeroes);
router.get('/create-hero', heroController.formData);

router.post('/create-hero', heroController.createHeroes);

router.get('/update-hero/:heroId', heroController.updateHero);

router.post('/update-hero/:heroId', heroController.editHero);

router.post('/delete-hero/:heroId', heroController.deleteHero);
router.get('/reset', heroController.reset);

router.get('/squads', heroController.getSquadsIndex);

router.get('/create-squad', heroController.createSquad);

router.post('/create-squad', heroController.creatSquard);

router.post('/delete-squad/:squadId', heroController.deleteSquad);

module.exports = router;

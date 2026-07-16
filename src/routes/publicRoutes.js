const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/live/:teacherId', publicController.getLiveContent);

module.exports = router;
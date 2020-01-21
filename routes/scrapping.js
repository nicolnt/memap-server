const express = require('express');
const router = express.Router();

const reference_controller = require('../controllers/potusScraper');

module.exports = function(app) {
	app.use('/reference', router);

	router.post('/', express.json(), reference_controller.write.getExternRef);
};
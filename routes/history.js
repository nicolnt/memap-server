const express = require('express');
const router = express.Router();

const history_controller = require('../controllers/history');

module.exports = function(app) {
	app.use('/history', router);
	router.get('/', history_controller.read.history.last5VisitedNeurons);
};

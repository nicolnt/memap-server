const express = require('express');
const router = express.Router();

const neuron_controller = require('../controllers/neuron');

module.exports = function(app) {

	app.use('/neuron-bubble', router);

	// NOTE: passing a callback that takes (req, res, next)
	
	router.get('/:uuid', neuron_controller.read.neuronBubbleByUUID);
};

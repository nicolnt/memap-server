const express = require('express');
const router = express.Router();

const neuron_controller = require('../controllers/neuron');

module.exports = function(app) {

	app.use('/neuron', router);

	// NOTE: passing a callback that takes (req, res, next)
	
	router.get('/:id', neuron_controller.read.entireNeuron.byIdNeuron);
	router.post('/', express.json(), neuron_controller.write.neuron.entire);
	//router.get('/id/:title', neuron_controller.read.idNeuron.byTitleNeuron);

};

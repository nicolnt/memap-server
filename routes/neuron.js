const express = require('express');
const router = express.Router();

const neuron_controller = require('../controllers/neuron');

module.exports = function(app) {

	app.get('/pinned/neuron', neuron_controller.read.allNeurons.pinned);
	app.get('/selected/neuron', neuron_controller.read.allNeurons.selected);

	app.use('/neuron', router);

	// NOTE: passing a callback that takes (req, res, next)
	
	router.get('/:uuid', neuron_controller.read.entireNeuron.byIdNeuron);
	router.patch('/:uuid', express.json(), neuron_controller.write.neuron.rename);
	router.delete('/:uuid', neuron_controller.write.neuron.delete);
	router.post('/', express.json(), neuron_controller.write.neuron.entire);

};

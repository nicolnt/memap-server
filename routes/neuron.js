const express = require('express');
const router = express.Router();

const neuron_controller = require('../controllers/neuron');

module.exports = function(app) {

	app.use('/neuron', router);

	// NOTE: passing a callback that takes (req, res, next)
	
	router.get('/:uuid', neuron_controller.read.entireNeuron.byUUID);
	router.patch('/:uuid', express.json(), neuron_controller.write.neuron.edit);
	router.put('/:uuid', express.json(), neuron_controller.write.neuron.add);

	router.put('/:uuid/unfavorite', neuron_controller.write.neuron.unfavorite);
	router.put('/:uuid/favorite', neuron_controller.write.neuron.favorite);
	router.put('/:uuid/select', neuron_controller.write.neuron.select);
	router.put('/:uuid/toggleselect', neuron_controller.write.neuron.toggleselect);
	router.put('/:uuid/togglefavorite', neuron_controller.write.neuron.togglefavorite);
	router.put('/:uuid/unselect', neuron_controller.write.neuron.unselect);

	router.delete('/:uuid', express.json(),neuron_controller.write.neuron.delete);
	router.post('/', express.json(), neuron_controller.addNeuron);
};

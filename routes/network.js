const express = require('express');
const router = express.Router();

const network_controller = require('../controllers/network');

module.exports = function(app) {

	app.use('/network', router);

	router.get('/selected', network_controller.read.selectedNeurons);
	router.get('/favorites', network_controller.read.favoriteNeurons);
	router.get('/orphans', network_controller.read.orphanNeurons);

	router.put('/unselectAll', network_controller.write.unselectAllNeurons);

	router.get('/around/:uuid', network_controller.read.closeGraph.byIdNeuron);

	router.post('/', express.json(), network_controller.write.relationship.single);
	router.delete('/', express.json(), network_controller.delete.relationship.single);
};

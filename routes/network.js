const express = require('express');
const router = express.Router();

const network_controller = require('../controllers/network');

module.exports = function(app) {

	app.use('/network', router);

	router.get('/:id', network_controller.read.closeGraph.byIdNeuron);

	router.post('/', express.json(), network_controller.write.relationship.single);
	router.delete('/', express.json(), network_controller.delete.relationship.single);
};

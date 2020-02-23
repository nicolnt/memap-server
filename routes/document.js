const express = require('express');
const router = express.Router();

const to = require('../exceptions/errorCatcher');
const interface = require('../controllers/interface/document');

module.exports = function(app) {

	app.use('/document', router);

	router.get('/test', to(interface.getAlltest));
	router.get('/all', to(interface.getAll));
	router.get('/:id', to(interface.getById));
	router.get('/:uuidDoc/neurons', to(interface.neuronsConnectedToDocument));
	router.post('/', express.json(), to(interface.create));
	router.put('/', express.json(), to(interface.edit));
	router.delete('/', express.json(), to(interface.delete));
};

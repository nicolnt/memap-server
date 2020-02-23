const express = require('express');
const router = express.Router();
const to = require('../exceptions/errorCatcher');


const document_controller = require('../controllers/interface/document');

module.exports = function(app) {

	app.use('/document', router);

	router.get('/all', to(document_controller.getAll));
	router.get('/:id', to(document_controller.getById));
	router.get('/:uuidDoc/neurons', to(document_controller.neuronsConnectedToDocument));
	router.post('/', express.json(), to(document_controller.create));
	router.put('/', express.json(), to(document_controller.edit));
	router.delete('/:id', to(document_controller.delete));
};

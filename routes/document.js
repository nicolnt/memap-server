const express = require('express');
const router = express.Router();

const document_controller = require('../controllers/document');

module.exports = function(app) {

	app.use('/document', router);

	router.get('/all', document_controller.getAll);
	router.get('/:id', document_controller.getById);
	router.get('/:uuidDoc/neurons', document_controller.neuronsConnectedToDocument);
	router.post('/', express.json(), document_controller.create);
	router.put('/', express.json(), document_controller.edit);
	router.delete('/:id', document_controller.delete);
};

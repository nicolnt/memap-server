const express = require('express');
const router = express.Router();

const document_controller = require('../controllers/document');

module.exports = function(app) {

	app.use('/document', router);

	router.get('/all', document_controller.read.listDocument);
	router.get('/:id', document_controller.read.entireDocument.byIdDocument);
	router.post('/', express.json(), document_controller.write.document.entire);
	router.put('/', express.json(), document_controller.write.document.edit);
	router.delete('/:id', document_controller.write.document.delete);
};

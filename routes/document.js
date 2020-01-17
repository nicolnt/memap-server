const express = require('express');
const router = express.Router();

const document_controller = require('../controllers/document');

module.exports = function(app) {

	app.use('/document', router);

	router.get('/:id', document_controller.read.entireDocument.byIdDocument);
	router.post('/', express.json(), document_controller.write.document.entire);
};

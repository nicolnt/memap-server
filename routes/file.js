const express = require('express');
const router = express.Router();

const fileUpload = require('express-fileupload');

const file_controller = require('../controllers/file');

module.exports = function(app) {

	app.use('/file', router);

	router.post('/', fileUpload(), file_controller.upload.singleFile.byCopy);
	router.get('/:id', file_controller.read.file.byIdFile);
	router.delete('/:id', file_controller.delete.file.byIdFile);
	router.patch('/:id', express.json(), file_controller.edit.file.name);
	//router.get('/:id', document_controller.read.entireDocument.byIdDocument);
};

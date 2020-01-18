const express = require('express');
const router = express.Router();

const fileUpload = require('express-fileupload');

const file_controller = require('../controllers/file');

module.exports = function(app) {

	app.use('/file', router);

	router.post('/', fileUpload(), file_controller.upload.singleFile.byCopy);
	router.get('/:uuid', file_controller.read.file.byIdFile);
	router.delete('/:uuid', file_controller.delete.file.byIdFile);
	router.patch('/:uuid', express.json(), file_controller.edit.file.name);
};

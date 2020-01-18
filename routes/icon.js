const fileUpload = require('express-fileupload');
const express = require('express');
const router = express.Router();

const icon_controller = require('../controllers/icon');

module.exports = function(app) {

	app.use('/icon', router);

	router.get('/:uuid', icon_controller.read.entireIcon.byUUID);
	router.post('/', fileUpload(), icon_controller.write.newIcon);
	router.delete('/:uuid', icon_controller.delete);
	router.patch('/:uuid', express.json(), icon_controller.write.rename);
};

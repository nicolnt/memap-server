const fileUpload = require('express-fileupload');
const express = require('express');
const router = express.Router();

const icon_controller = require('../controllers/icon');

module.exports = function(app) {

	app.use('/icon', router);

	router.get('/:name', icon_controller.read.entireIcon.byIconName);
	router.post('/', fileUpload(), icon_controller.write.newIcon);
	router.delete('/:name', icon_controller.delete);
	router.patch('/:name', express.json(), icon_controller.write.edit);
};

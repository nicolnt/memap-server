const express = require('express');
const router = express.Router();

const type_controller = require('../controllers/type');

module.exports = function(app) {

	app.use('/type', router);

	router.get('/:name', type_controller.read.byName);
	router.get('/', type_controller.read.allTypes);
	router.patch('/:name', express.json(), type_controller.write.edit);
	router.delete('/:name', express.json(), type_controller.deleteOne);
	router.delete('/', type_controller.deleteAll);
	router.post('/', express.json(), type_controller.write.create);
};

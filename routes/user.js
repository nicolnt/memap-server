const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/user');

module.exports = function(app) {

	app.use('/user', router);
	
	router.get('/:uuid', user_controller.getById);
	router.post('/auth', express.json(), user_controller.authentify);
	router.post('/', express.json(), user_controller.create);
	router.put('/pwd', express.json(), user_controller.edit);
	router.delete('/:uuid', user_controller.delete);
};

const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/user');

module.exports = function(app) {

	app.use('/user', router);
	
	router.post('/auth', express.json(), user_controller.read.authentify);
	router.post('/', express.json(), user_controller.write.user.addUser);
	router.put('/pwd', express.json(), user_controller.write.user.editPwd);
	router.delete('/:uuid', user_controller.write.user.delete);
};

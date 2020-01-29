const express = require('express');
const router = express.Router();

const reference_controller = require('../controllers/reference');

module.exports = function(app) {
	app.use('/reference', router);

	router.put('/', express.json(), reference_controller.write.editRef);
	router.post('/', express.json(), reference_controller.write.getExternRef);
	router.post('/intern', express.json(), reference_controller.write.getInternRef);
	router.post('/page', express.json(), reference_controller.write.getPage);
	router.post('/delete', express.json(), reference_controller.write.deleteRef);

};
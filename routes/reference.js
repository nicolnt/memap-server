const express = require('express');
const router = express.Router();

const interface = require('../controllers/interface/reference');

module.exports = function(app) {
	app.use('/reference', router);

	router.put('/', express.json(), interface.edit);
	router.post('/', express.json(), interface.getExt);
	router.post('/intern', express.json(), interface.getInt);
	router.post('/page', express.json(), interface.getPage);
	router.post('/delete', express.json(), interface.delete);
};
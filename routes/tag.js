const express = require('express');
const router = express.Router();

const tag_controller = require('../controllers/tag');

module.exports = function(app) {

	app.use('/tag', router);

	router.get('/:name', tag_controller.read.byName);
	router.get('/', tag_controller.read.allTags);
	router.patch('/:name', express.json(), tag_controller.write.rename);
	router.delete('/:name', tag_controller.write.delete);
	router.post('/', express.json(), tag_controller.write.create);

};

const express = require('express');
const path = require('path');

module.exports = function(app) {

	app.get('/', (req, res) => {
		res.status(200).send({ usage: "Nothing to do here" });
	});

	// NOTE: Serve static files
	// INFO: Use this route file's path to ppoint to the public folder
	app.use('/static', express.static(path.join(__dirname, '../', 'public')));

	require('./neuron')(app);
	require('./network')(app);
	require('./document')(app); 
	require('./icon')(app); 
	require('./file')(app);
	require('./tag')(app);
	require('./type')(app);
	require('./reference')(app);
}

const express = require('express');
const app = express();

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, append,delete,entries,foreach,get,has,keys,set,values,Authorization");
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT, PATCH");
	next();
});

// NOTE: middleware function that gets executed first
app.use((req, res, next) => {
	// NOTE: Body of the request (post and put request for instance)
	// http://expressjs.com/en/4x/api.html#req.body
	console.log('Request body: ', req.body); 

	// NOTE: Query string parameter
	// http://expressjs.com/en/4x/api.html#req.query
	console.log('Request query parameters: ',req.query); 

	next(); // NOTE: Don't forget to pursue to the next middleware otherwise the server stops
});

require('./routes/index')(app);

const port = 3000;
if (!module.parent) {
	app.listen(port, () => { console.log(`Listening on port ${port}`) });
}

/* NOTE: Useless for now

const login = require('../logics/security');

const checkLogin = (req, res, next) => {
	if (login.checkIfThereIsAToken(req)) {

		// NOTE: Extract token part from 'Bearer test_TOKEN123'
		const token = req.get('Authorization').match(/^(Bearer )(.+)/)[2];
		console.log('Token found: ', token);

		if ( login.validateTocken(token) ) {
			console.log('Login succeed');
			next('route'); // NOTE: Login OK, skip to next route
		} else {
			console.log('Invalid token provided');
			res.status(500).send({ error: 'Bad token' });
		}
	}
	else {
		console.log('Please provide a token to use the API');
		res.status(500).send({ error: "No token" });
	}
}

module.exports = function(app) {

	// NOTE: match all app.METHOD()
	app.all('*', checkLogin);

};
*/

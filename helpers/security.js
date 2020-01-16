module.exports = {
	checkIfThereIsAToken(req) {
		// NOTE: return a specific HTTP header
		// http://expressjs.com/en/4x/api.html#req.get
		console.log('Auth: ', req.get('Authorization'));
		if (req.get('Authorization')) {
			return true;
		}
		else return false;
	},
	validateTocken(token) {
		if (token === 'test_TOKEN123') return true;
		else return false;
	}
};

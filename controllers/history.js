const history_model = require('../models/history');

module.exports = {
	read: {
		history: {
			last5VisitedNeurons(req, res) {

				history_model.getLast5VisitedNeurons()
					.then(data => {

						if (data) res.status(200);
 						else res.send(404);

						res.send(data);
					})
					.catch(err => {
						if (err) res.status(500);
						res.end();
					});

			}
		}
	}
};

const document_model = require('../models/document');

module.exports = {
	read: {
		entireDocument: {
			byIdDocument(req, res) {

				document_model.getDocumentById(req.params.id)
					.then(data => {

						const json = {
								neuron: data
						}

						if (data) res.status(200);
 						else res.send(404);

						res.send(json);
					})
					.catch(err => {
						if (err) res.status(500);
						res.end();
					});

			}
		}
	},

	write: {

		document: {

			entire(req, res) {
				
				// NOTE: Passing the request body, it has to match with the db properties !!
				document_model.createDocument(req.body)
					.then(() => {
						
						res.status(200).send({});
					})
					.catch(err => {
						if (err) res.status(500).end(err);
					});

			}
		}

	}
};

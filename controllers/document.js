const document_model = require('../models/document');

module.exports = {
	read: {
		listDocument(req, res) {
			document_model.getDocumentsList()
					.then(data => {

						const json = {
								documents: data
						}

						if (data) res.status(200);
 						else res.send(404);

						res.send(json);
					})
					.catch(err => {
						if (err) res.status(500).send(err);
						res.end();
					});
		},

		entireDocument: {
			byIdDocument(req, res) {

				document_model.getDocumentById(req.params.id)
					.then(data => {

						const json = {
								document: data
						}

						if (data) res.status(200);
 						else res.send(404);

						res.send(json);
					})
					.catch(err => {
						if (err) res.status(500).send(err);
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
						if (err) res.status(500).send(err);
						res.end();
					});

			},

			edit(req, res) {
				// NOTE: Passing the request body, it has to match with the db properties !!
				document_model.editDocument(req.body)
					.then(() => {	
						res.status(200).send({});
					})
					.catch(err => {
						if (err) res.status(500).send(err);
						res.end();
					});
			}
		}

	}
};

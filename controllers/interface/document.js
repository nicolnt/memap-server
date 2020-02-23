const document_model = require('../../models/document');
const Document = require('../CRUD/Document.js');
const checkIn = require('../../helpers/checkIn');
const timer = require('../../dev/timer');

module.exports = {
		neuronsConnectedToDocument(req, res) {
			document_model.getNeuronsConnectedToDocumentByUUID(req.params.uuidDoc)
					.then(data => {
						if (data) res.status(200);
 						else res.send(404);
						res.send(data);
					})
					.catch(err => {
						if (err) res.status(500).send(err);
						res.end();
					});
		},

		async getAll(req, res) {
			res.status(200).send({
				documents: await Document.$getAll()
			});
		},

		async getById(req, res) {
			res.status(200).send({
				document: await Document.$getByUuid(req.params.id)
			});
		},

		async create(req, res) {
			checkIn.isRequire(req.body, ['title']);
			await Document.$create(new Document(req.body));
			res.status(200).send({});
		},

		async edit(req, res) {
			checkIn.isRequire(req.body, ['uuid']);
			await Document.$update(new Document(req.body));
			res.status(200).send({});
		},
			
		async delete(req, res) {
			checkIn.isRequire(req.body, ['uuid']);
			await Document.$delete(new Document(req.body));
			res.status(200).send({});
		}
};

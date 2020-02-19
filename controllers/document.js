const document_model = require('../models/document');
const Document = require('./CRUD/Document.js');

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
			var documentList = await Document.$getAll();
			var json = {documents:[]};
			documentList.forEach(element => {
				json['documents'].push(element.json);
			});

			res.status(200);
			res.send(json);
		},

		async getById(req, res) {
			var doc = await Document.$getByUuid(req.params.id)
			const json = {
				document: doc.json
			}
			res.status(200);
			res.send(json);
		},

		async create(req, res) {
			var doc = new Document(req.body);
			await Document.$create(doc);
			res.status(200).send({});
		},

		async edit(req, res) {
			var doc = new Document(req.body);
			await Document.$update(doc);
			res.status(200).send({});
		},
			
		async delete(req, res) {
			await Document.$delete(req.params.id);
			res.status(200).send({});
		}
};

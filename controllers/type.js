const type_model = require('../models/type');

module.exports = {
	read: {
		byName(req, res, next) {

			type_model.getTypeByName(req.params.name)
				.then( newType => {

					if (newType) res.status(200);
 					else res.send(404);

					res.send(newType);
				})
				.catch(err => {
					if (err) res.status(500);
					res.end();
				});

		},
		allTypes(req, res) {
			type_model.getAllTypes()
				.then( types => {
					res.status(200).send(types);
				})
				.catch(err => {
					console.log(err);
					res.status(500).end();
				});
		}
	},

	write: {

		create(req, res) {

			type_model.createType(req.body.name)
				.then( type => {
					res.status(200).send( type );
				})
				.catch(err => {
					if (err) res.status(500).end();
				});

		},
		rename(req, res) {
			type_model.rename(req.params.name, req.body.name)
				.then( type => {
					res.status(200).send(type);
				})
				.catch(err => {
					console.log(err);
					res.status(500).end();
				});
		},
		delete(req, res) {
			type_model.deleteByName(req.params.name)
				.then( message => {
					res.status(200).send(message);
				})
				.catch(err => {
					console.log(err);
					res.status(500).end();
				});
		}
	}
};

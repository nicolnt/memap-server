const type_model = require('../models/type');

module.exports = {
	read: {
		byName(req, res, next) {

			type_model.getTypeByName(req.params.name)
				.then( type => {

					if (type) res.status(200);
 					else res.send(404);

					res.send(type);
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

			// NOTE: Choosing the right function
			let model = ( req.body.icon ) ? type_model.createTypeWithIcon : type_model.createTypeWithoutIcon;

			model(req.body)
				.then( type => {
					res.status(200).send( type );
				})
				.catch(err => {
					if (err) res.status(500).end();
				});

		},
		edit(req, res) {

			let model = (req.body.icon)? type_model.editNameAndColorAndIcon : type_model.editNameAndColor;

			model(req.params.name, req.body)
				.then( type => {
					res.status(200).send(type);
				})
				.catch(err => {
					console.log(err);
					res.status(500).end();
				});
		}
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
	deleteOne(req, res) {
		var model;
		if (req.body == {}) {
			if (req.body.icon && req.body.color) model = type_model.removeColorAndIcon;
			else if (req.body.icon) model = type_model.removeIcon;
			else model = type_model.removeColor;
		} else model = type_model.deleteByName;

		model(req.params.name)
			.then( data => {
				res.status(200).send(data);
			})
			.catch(err => {
				console.log(err);
				res.status(500).end();
			});
	},

	deleteAll(req, res) {
		type_model.deleteAll()
			.then( message => {
				res.status(200).send(message);
			})
			.catch(err => {
				console.log(err);
				res.status(500).end();
			});
	}
};

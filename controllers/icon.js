// TODO: manage icon files

const icon_model = require('../models/icon');

module.exports = {
	read: {
		entireIcon: {
			byIconName(req, res) {

				icon_model.getIconByName(req.params.name)
					.then(icon => {

						if (icon) res.status(200);
 						else res.send(404);

						res.send(icon);
					})
					.catch(err => {
						if (err) res.status(500).end();
					});
			}
		}
	},

	write: {

		newIcon(req, res) {

			icon_model.createIcon(req.body)
				.then( icon => {
					res.status(200).send( icon );
				})
				.catch(err => {
					if (err) res.status(500).end();
				});
		},
		edit(req, res) {

			icon_model.editIcon(req.params.name, req.body)
				.then( icon => {
					res.status(200).send( icon );
				})
				.catch(err => {
					if (err) res.status(500).end();
				});
		}
	},
	delete(req, res) {
		icon_model.deleteIcon(req.params.name)
			.then(() => {
				res.status(200).end();
			})
			.catch(err => {
				console.log(err);
				res.status(500).end();
			});
	}
};

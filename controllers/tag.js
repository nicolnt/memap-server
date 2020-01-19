const tag_model = require('../models/tag');

module.exports = {
	read: {
		byName(req, res, next) {

			tag_model.getTagByName(req.params.name)
				.then( newTag => {

					if (newTag) res.status(200);
 					else res.send(404);

					res.send(newTag);
				})
				.catch(err => {
					if (err) res.status(500);
					res.end();
				});

		},
		allTags(req, res) {
			tag_model.getAllTags()
				.then( tags => {
					res.status(200).send(tags);
				})
				.catch(err => {
					console.log(err);
					res.status(500).end();
				});
		}
	},

	write: {

		create(req, res) {
			let model = (req.body.icon)?tag_model.createTagWithIcon:tag_model.createTagWithoutIcon;
			model(req.body)
				.then( tag => {
					res.status(200).send( tag );
				})
				.catch(err => {
					if (err) res.status(500).end();
				});

		},
		edit(req, res) {
			let model = (req.body.icon)? tag_model.renameAndChangeIcon : tag_model.rename;

			model(req.params.name, req.body)
				.then( tag => {
					res.status(200).send(tag);
				})
				.catch(err => {
					console.log(err);
					res.status(500).end();
				});
		},
		deleteAll(req, res) {
			tag_model.deleteAll()
				.then( message => {
					res.status(200).send(message);
				})
				.catch(err => {
					console.log(err);
					res.status(500).end();
				});
		},
		deleteOne(req, res) {
			const model = (Object.keys(req.body).length) ? tag_model.removeIcon : tag_model.deleteByName;

			model(req.params.name)
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

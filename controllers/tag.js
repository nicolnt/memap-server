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

			tag_model.createTag(req.body.name)
				.then( tag => {
					res.status(200).send( tag );
				})
				.catch(err => {
					if (err) res.status(500).end();
				});

		},
		rename(req, res) {
			tag_model.rename(req.params.name, req.body.name)
				.then( tag => {
					res.status(200).send(tag);
				})
				.catch(err => {
					console.log(err);
					res.status(500).end();
				});
		},
		delete(req, res) {
			tag_model.deleteByName(req.params.name)
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

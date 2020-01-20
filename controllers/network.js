const network_model = require('../models/network');

module.exports = {
	read: {
		closeGraph: {
			byIdNeuron(req, res) {

				network_model.getCloseNetworkByNeuronId(req.params.uuid)
					.then(data => {

						const json = {
								network: data
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
		},
		orphanNeurons(req, res) {
				network_model.getAllOrphanNeurons()
					.then( neurons => {
						res.status(200).send(neurons);
					})
					.catch(err => {
						console.log(err);
						res.status(500).end();
					})
		},
		selectedNeurons(req, res) {
				network_model.getAllSelectedNeurons()
					.then( neurons => {
						res.status(200).send(neurons);
					})
					.catch(err => {
						console.log(err);
						res.status(500).end();
					})
		},
		favoriteNeurons(req, res) {
				network_model.getAllFavoriteNeurons()
					.then( neurons => {
						res.status(200).send(neurons);
					})
					.catch(err => {
						console.log(err);
						res.status(500).end();
					})
		}
	},

	write: {
		unselectAllNeurons(req, res) {
				network_model.unselectAllNeurons()
					.then( neurons => {
						res.status(200).send(neurons);
					})
					.catch(err => {
						console.log(err);
						res.status(500).end();
					})
		},
		relationship: {

			single(req, res) {
				
				network_model.createRelationship(req.body.uuidFrom, req.body.uuidTo, req.body.type)
					.then(() => {
						
						res.status(200).send({});
					})
					.catch(err => {
						if (err) res.status(500).end(err);
					});

			}
		}

	},

	delete: {

		relationship: {

			single(req, res) {
				
				network_model.deleteRelationship(req.body.uuidFrom, req.body.uuidTo, req.body.type)
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

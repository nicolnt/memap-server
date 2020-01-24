const neuron_model = require('../models/neuron');

module.exports = {
	read: {
		entireNeuron: {
			byUUID(req, res, next) {

				neuron_model.getNeuronByUUID(req.params.uuid)
					.then(data => {

						const json = {
								neuron: data
						}

						if (data) res.status(200);
 						else res.status(404);

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

		neuron: {
			togglefavorite(req, res) {
					neuron_model.toggleFavoriteNeuronByUUID(req.params.uuid)
						.then( neuron => {
							res.status(200).send(neuron);
						})
						.catch(err => {
							console.log(err);
							res.status(500).end();
						});
			},
			toggleselect(req, res) {
					neuron_model.toggleSelectNeuronByUUID(req.params.uuid)
						.then( neuron => {
							res.status(200).send(neuron);
						})
						.catch(err => {
							console.log(err);
							res.status(500).end();
						});
			},
			select(req, res) {
					neuron_model.selectNeuronByUUID(req.params.uuid)
						.then( neuron => {
							res.status(200).send(neuron);
						})
						.catch(err => {
							console.log(err);
							res.status(500).end();
						});
			},
			unselect(req, res) {
					neuron_model.unselectNeuronByUUID(req.params.uuid)
						.then( neuron => {
							res.status(200).send(neuron);
						})
						.catch(err => {
							console.log(err);
							res.status(500).end();
						});
			},
			unfavorite(req, res) {
					neuron_model.unfavoriteNeuronByUUID(req.params.uuid)
						.then( neuron => {
							res.status(200).send(neuron);
						})
						.catch(err => {
							console.log(err);
							res.status(500).end();
						});
			},
			favorite(req, res) {
					neuron_model.favoriteNeuronByUUID(req.params.uuid)
						.then( neuron => {
							res.status(200).send(neuron);
						})
						.catch(err => {
							console.log(err);
							res.status(500).end();
						});
			},
			add(req, res) {
				if (req.body.hasOwnProperty( 'document' )) {
					neuron_model.addDocument(req.params.uuid, req.body.document)
						.then( neuron => {
							res.status(200).send(neuron);
						})
						.catch(err => {
							console.log(err);
							res.status(500).end();
						});
				}
				if (req.body.hasOwnProperty( 'file' )) {
					neuron_model.addFile(req.params.uuid, req.body.file)
						.then( neuron => {
							res.status(200).send(neuron);
						})
						.catch(err => {
							console.log(err);
							res.status(500).end();
						});
				}
			},

			entire(req, res) {

				neuron_model.createNeuron(req.body)
					.then((neuron) => {
						res.status(200).send(neuron);
					})
					.catch(err => {
						if (err) res.status(500).end();
					});

			},
			async edit(req, res) {
				if (req.body.hasOwnProperty( 'color' )) {
					await neuron_model.changeColor(req.params.uuid, req.body.color)
						.then( neuron => {
						})
						.catch(err => {
							console.log(err);
							res.status(500).end();
						});
				}
				if (req.body.hasOwnProperty( 'name' )) {
					await neuron_model.renameByUUID(req.params.uuid, req.body.name)
						.then( neuron => {
						})
						.catch(err => {
							console.log(err);
							res.status(500).end();
						});
				}
				if (req.body.hasOwnProperty( 'tags' )) {
					await neuron_model.editTags(req.params.uuid, req.body.tags)
						.then( neuron => {
						})
						.catch(err => {
							console.log(err);
							res.status(500).end();
						});
				}
				if (req.body.hasOwnProperty( 'icon' )) {
					await neuron_model.changeIcon(req.params.uuid, req.body.icon)
						.then( neuron => {
						})
						.catch(err => {
							console.log(err);
							res.status(500).end();
						});
				}
				if (req.body.hasOwnProperty( 'type' )) {
					await neuron_model.changeType(req.params.uuid, req.body.type)
						.then( neuron => {
						})
						.catch(err => {
							console.log(err);
							res.status(500).end();
						});
				}
				neuron_model.getNeuronByUUID(req.params.uuid)
						.then( neuron => {
							res.status(200).send(neuron);
						})
						.catch(err => {
							console.log(err);
							res.status(500).end();
						});
			},
			delete(req, res) {
				if (req.body) {
					if (req.body.hasOwnProperty( 'document' )) {
						neuron_model.removeDocument(req.params.uuid, req.body.document)
							.then( neuron => {
								res.status(200).send(neuron);
							})
							.catch(err => {
								console.log(err);
								res.status(500).end();
							});
					}
					if (req.body.hasOwnProperty( 'file' )) {
						neuron_model.removeFile(req.params.uuid, req.body.file)
							.then( neuron => {
								res.status(200).send(neuron);
							})
							.catch(err => {
								console.log(err);
								res.status(500).end();
							});
					}
				}
				else {
					neuron_model.deleteByUUID(req.params.uuid)
						.then( message => {
							res.status(200).end(message);
						})
						.catch(err => {
							console.log(err);
							res.status(500).end();
						});
				}
			}
		}
	}
};

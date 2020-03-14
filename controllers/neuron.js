const neuron_model = require('../models/neuron');

module.exports = {
	async addNeuron(req, res) {
		try {
			const newNeuronID = await neuron_model.createNeuron(req.body);
			// NOTE: The trick of getting the id and then the UUID is necessary to retrieve the neuron's UUID as Neo4j doesn't allow us to retrieve it on node creation
			const newNeuronUUID = await neuron_model.getNeuronUUIDByID(newNeuronID);
			res.status(200).send({ newNeuronUUID });
		} catch (err) {
			console.log(err);
			res.status(500).end();
		}
	},
	read: {
		async neuronBubbleByUUID(req, res, next) {
				let neuron;
				if ( req.query.hasOwnProperty('timestamp') ) {
					neuron = await neuron_model.getNeuronBubbleByUUIDIfChangedAfterTimestamp(req.params.uuid, req.query.timestamp);
				}
				else {
					neuron = await neuron_model.getNeuronBubbleByUUID(req.params.uuid);
				}
				if (neuron) res.status(200).send(neuron);
				else res.status(204).end(); // No Content: the neuron state is older than the provided timestamp, so it has not changed
				//else res.status(500).end(); 
		},
		entireNeuron: {
			async byUUID(req, res, next) {
				let neuron;
				if ( req.query.hasOwnProperty('timestamp') ) {
					neuron = await neuron_model.getNeuronByUUIDIfChangedAfterTimestamp(req.params.uuid, req.query.timestamp);
				}
				else {
					neuron = await neuron_model.getNeuronByUUID(req.params.uuid);
				}
				if (neuron) res.status(200).send(neuron);
				else res.status(204).end(); // No Content: the neuron state is older than the provided timestamp, so it has not changed
				//else res.status(500).end(); 
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
				neuron_model.createneuron(req.body)
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
				if (req.body.hasOwnProperty( 'icon_name' )) {
					await neuron_model.changeIconByFAname(req.params.uuid, req.body.icon_name)
						.then( neuron => {
						})
						.catch(err => {
							console.log(err);
							res.status(500).end();
						});
				}
				if (req.body.hasOwnProperty( 'icon_uuid' )) {
					await neuron_model.changeIconByUUID(req.params.uuid, req.body.icon_uuid)
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
				if (Object.keys(req.body).length) {
					if (req.body.hasOwnProperty( 'tag' )) {
						neuron_model.removeSingleTag(req.params.uuid, req.body.tag)
							.then( neuron => {
								res.status(200).send(neuron);
							})
							.catch(err => {
								console.log(err);
								res.status(500).end();
							});
					}
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
							res.status(200).send(message);
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

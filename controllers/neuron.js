const neuron_model = require('../models/neuron');

module.exports = {
	read: {
		entireNeuron: {
			byIdNeuron(req, res, next) {

				neuron_model.getNeuronById(req.params.id)
					.then(data => {

						const json = {
								neuron: data
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
		}
	},

	write: {

		neuron: {

			entire(req, res) {

				// NOTE: Passing the request body, it has to match with the db properties !!
				neuron_model.createNeuron(req.body)
					.then(() => {
						res.status(200).send({});
					})
					.catch(err => {
						if (err) res.status(500).end();
					});

			},
			rename(req, res) {
				neuron_model.renameById(req.params.uuid, req.body.name)
					.then( neuron => {
						res.status(200).send(neuron);
					})
					.catch(err => {
						console.log(err);
						res.status(500).end();
					});
			},
			delete(req, res) {
				neuron_model.deleteById(req.params.uuid)
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
};

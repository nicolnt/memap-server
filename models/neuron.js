const neo4j = require('../db').neo4j;
const neoDriver = require('../db').driver;

module.exports = {

	getNeuronById(uuid) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
		MATCH (neuron:Neuron)
		WHERE neuron.uuid = $uuid
		RETURN neuron
			`,
				{
					uuid
				})
				.then(result => {

					let data = {};

					if (result.records.length >= 1 ) data = result.records[0].get('neuron').properties;

					resolve( data );
				})
				.catch(error => {
					reject( error );
				})
				.then(() => {
					session.close();
				});

		});
	},
	getAllSelectedNeurons() {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
		MATCH (n:Neuron:SELECTED)
		RETURN n AS neuron
			`)
				.then(result => {

					let data = result.records;
					if (result.records.length >= 1 ) {
						data = result.records.map(node => {
								return node.get('neuron').properties; 
						});
					}

					resolve( data );
				})
				.catch(error => {
					reject( error );
				})
				.then(() => {
					session.close();
				});

		});
	},
	getAllPinnedNeurons() {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
		MATCH (n:Neuron:PINNED)
		RETURN n AS neuron
			`)
				.then(result => {

					let data = result.records;
					if (result.records.length >= 1 ) {
						data = result.records.map(node => {
								return node.get('neuron').properties; 
						});
					}

					resolve( data );
				})
				.catch(error => {
					reject( error );
				})
				.then(() => {
					session.close();
				});

		});
	},
	deleteById(uuid) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (n:Neuron {uuid: $uuid})
			DETACH DELETE n
			`,
				{
					uuid
				})
				.then(result => {

					let data = {};
					//if (result.records.length >= 1 ) data = result.records[0].get('neuron').properties;
					if (result.summary.counters.updates().nodesDeleted != 1) data.message = "No Neuron deleted"; 
					else data.message = "One Neuron deleted";
					resolve( data );
				})
				.catch(error => {
					reject( error );
				})
				.then(() => {
					session.close();
				});

		});
	},

	renameById(uuid, name) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
		MATCH (n:Neuron {uuid: $uuid})
		SET n.name = $name
		RETURN n AS neuron
			`,
				{
					uuid,
					name
				})
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) data = result.records[0].get('neuron').properties;

					resolve( data );
				})
				.catch(error => {
					reject( error );
				})
				.then(() => {
					session.close();
				});

		});
	},
	createNeuron(neuron) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			CREATE (neuron:Neuron)
			SET neuron = $props,
			neuron.dateCreated = TIMESTAMP(),
			neuron.dateEdited = TIMESTAMP(),
			neuron.dateConsulted = TIMESTAMP()
			RETURN neuron
			`,
				{
					"props": neuron 
				})
				.then(result => {
					// NOTE: very important to check on result.records because it is illegal to .get() on a non-existing record
					if (result.records.length >= 1 ) resolve();
					else reject();
				})
				.catch(error => {
					reject( error );
				})
				.then(() => {
					session.close();
				});

		});
	}

}

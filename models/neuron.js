const neo4j = require('../db').neo4j;
const neoDriver = require('../db').driver;

module.exports = {

	getNeuronById(id) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
		MATCH (neuron:Neuron)
		WHERE neuron.uuid = $uuid
		RETURN neuron
			`,
				{
					"uuid": id 
				})
				.then(result => { // INFO: You must put RETURN n.label AS label -> get('label'), otherwise if RETURN n.label -> get('n.label')

					let data;

					/* OPTIMIZE: There si a more straightforward approach, see below
					// NOTE: very important to check on result.records because it is illegal to .get() on a non-existing record
					if (result.records.length >= 1 ) {
						var name = result.records[0].get('neuron').properties.name;
						var dateCreated = result.records[0].get('neuron').properties.dateCreated;
						var dateEdited = result.records[0].get('neuron').properties.dateEdited;
						var dateConsulted = result.records[0].get('neuron').properties.dateConsulted;
						var icon = result.records[0].get('neuron').properties.icon;
					}

					const data = {
						"name": name,
						"dateCreated": dateCreated,
						"dateEdited": dateEdited,
						"dateConsulted": dateConsulted,
						"icon": icon
					}
					*/ 

					// NOTE: Much simplier :D copy properties object into data!!
					// INFO: non extistent properties are not included
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

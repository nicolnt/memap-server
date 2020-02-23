const neo4j = require('./db').neo4j;
const neoDriver = require('./db').driver;

module.exports = {

	getLast5VisitedNeurons() {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
			MATCH (n:Neuron)
			RETURN n.uuid AS uuid
			ORDER BY n.dateConsulted DESC 
			LIMIT 5
			`)
				.then(result => {
					let data = result.records;
					if (result.records.length >=1 ) {
						data = data.map(neuron =>  {
							return neuron.get('uuid');
						})
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
	}
}

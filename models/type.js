const neo4j = require('../db').neo4j;
const neoDriver = require('../db').driver;

module.exports = {

	getAllTypes() {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
		MATCH (t:Type)
		RETURN t AS type
			`)
				.then(result => {

					let data = result.records;
					if (result.records.length >= 1 ) {
						data = result.records.map(node => {
								return node.get('type').properties; 
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
	getTypeByName(name) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
		MATCH (t:Type)
		WHERE t.name = $name
		RETURN t AS type
			`,
				{
					name
				})
				.then(result => {

					let data = {};

					if (result.records.length >= 1 ) data = result.records[0].get('type').properties;

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
	deleteByName(name) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (t:Type {name: $name})
			DETACH DELETE t
			`,
				{
					name
				})
				.then(result => {

					let data = {};
					if (result.summary.counters.updates().nodesDeleted != 1) data.message = "No Type deleted"; 
					else data.message = "One Type deleted";
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

	rename(name, newName) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
		MATCH (t:Type {name: $name})
		SET t.name = $newName
		RETURN t AS type
			`,
				{
					name,
					newName
				})
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) data = result.records[0].get('type').properties;

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
	createType(name) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			CREATE (t:Type)
			SET t.name = $name
			RETURN t AS type
			`,
				{
					name
				})
				.then(result => {
					if (result.records.length >= 1 ) resolve( result.records[0].get('type').properties );
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

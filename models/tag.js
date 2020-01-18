const neo4j = require('../db').neo4j;
const neoDriver = require('../db').driver;

module.exports = {

	getAllTags() {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
		MATCH (t:Tag)
		RETURN t AS tag
			`)
				.then(result => {

					let data = result.records;
					if (result.records.length >= 1 ) {
						data = result.records.map(node => {
								return node.get('tag').properties; 
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
	getTagByName(name) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
		MATCH (t:Tag)
		WHERE t.name = $name
		RETURN t AS tag
			`,
				{
					name
				})
				.then(result => {

					let data = {};

					if (result.records.length >= 1 ) data = result.records[0].get('tag').properties;

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
			MATCH (t:Tag {name: $name})
			DETACH DELETE t
			`,
				{
					name
				})
				.then(result => {

					let data = {};
					if (result.summary.counters.updates().nodesDeleted != 1) data.message = "No Tag deleted"; 
					else data.message = "One Tag deleted";
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
		MATCH (t:Tag {name: $name})
		SET t.name = $newName
		RETURN t AS tag
			`,
				{
					name,
					newName
				})
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) data = result.records[0].get('tag').properties;

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
	createTag(name) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			CREATE (t:Tag)
			SET t.name = $name
			RETURN t AS tag
			`,
				{
					name
				})
				.then(result => {
					if (result.records.length >= 1 ) resolve( result.records[0].get('tag').properties );
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

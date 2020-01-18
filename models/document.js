const neo4j = require('../db').neo4j;
const neoDriver = require('../db').driver;

module.exports = {

	getDocumentsList() {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
			MATCH (d:Document)
			RETURN d
			`,
				{})
				.then(result => { // INFO: You must put RETURN n.label AS label -> get('label'), otherwise if RETURN n.label -> get('n.label')
					var data = [];

					result.records.forEach(element => {
						data.push(element.get('d').properties);
					});
					resolve(data);
				})
				.catch(error => {
					reject( error );
				})
				.then(() => {
					session.close();
				});

		});
	},

	getDocumentById(id) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
		MATCH (d:Document) WHERE d.uuid = $uuid
		SET d.dateConsult = TIMESTAMP() 
		RETURN d
			`,
				{
					"uuid": id 
				})
				.then(result => { // INFO: You must put RETURN n.label AS label -> get('label'), otherwise if RETURN n.label -> get('n.label')

					let data;

					// NOTE: Much simplier :D copy properties object into data!!
					// INFO: non extistent properties are not included
					if (result.records.length >= 1 ) data = result.records[0].get('d').properties;

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

	createDocument(document) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE});
			session.run(`
			CREATE (d:Document)
			SET d = $props,
			d.dateCreated = TIMESTAMP(),
			d.dateEdit = TIMESTAMP(),
			d.dateConsult = TIMESTAMP()
			RETURN d
			`,
				{
					"props": document 
				})
				.then(result => {
					if (result.records.length >= 1 ) resolve();
					else reject();
				})
				.catch(error => {
					reject(error);
				})
				.then(() => {
					session.close();
				});

		});
	},

	editDocument(document) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE});
			session.run(`
			MATCH (d:Document) WHERE d.uuid = $uuid
			SET d += $props,
			d.dateEdit = TIMESTAMP(),
			d.dateConsult = TIMESTAMP()
			RETURN d
			`,
				{
					"uuid": document.uuid,
					"props": document 
				})
				.then(result => {
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
	},

	deleteDocument(id) {

		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE});
			session.run(`
			MATCH (d:Document) WHERE d.uuid = $uuid
			DELETE d
			`,
				{
					"uuid": id,
				})
				.then(result => {
					resolve();
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


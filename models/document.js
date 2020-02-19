const neo4j = require('../db').neo4j;
const neoDriver = require('../db').driver;


module.exports = {

	//A déplacer dans neuron model.
	getNeuronsConnectedToDocumentByUUID(uuidDocument) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
			MATCH (:Document {uuid: $uuidDocument})--(n:Neuron)
			RETURN n.uuid AS neuron_uuid
			`,
				{
					uuidDocument
				})
				.then(result => { // INFO: You must put RETURN n.label AS label -> get('label'), otherwise if RETURN n.label -> get('n.label')
					var data = [];

					result.records.forEach(element => {
						data.push(element.get('neuron_uuid'));
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


	async getAll() {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			var result = await session.run(`
			MATCH (d:Document)
			RETURN d as document
			`,
			{})
			return result;
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

	async getDocumentByUuid(id) {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			var data = await session.run(`
				MATCH (d:Document) WHERE d.uuid = $uuid
				SET d.dateConsult = TIMESTAMP() 
				RETURN d as document
			`,
			{
				"uuid": id 
			});
			return data.records[0].get('document').properties;
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


	async create(document) {
		const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE});
		var data = await session.run(`
			CREATE (d:Document)
			SET d = $props,
			d.dateCreated = TIMESTAMP(),
			d.dateEdit = TIMESTAMP(),
			d.dateConsult = TIMESTAMP()
			RETURN d as document
			`,
			{
				"props": document.json
			})
			if(data != undefined) {
				document.uuid = data.records[0].get('document').properties.uuid;
				return document;
			} else {
				// lève une exception
			}
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

	edit(document) {
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
					"props": document.json
			})
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
	},

	delete(id) {
		const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE});
		session.run(`
		MATCH (d:Document) WHERE d.uuid = $uuid
		DELETE d
		`,
		{
			"uuid": id,
		})
	}
}


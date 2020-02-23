const neo4j = require('../db').neo4j;
const neoDriver = require('../db').driver;
const neo = require('./neo4j');

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

	async getAll() {
			return await neo('READ', 
				`
				MATCH (d:Document)
				RETURN d as document
				`,
				{}
			);
	},

	async getDocumentByUuid(id) {
			return await neo('READ',
				`
				MATCH (d:Document) WHERE d.uuid = $uuid
				SET d.dateConsult = TIMESTAMP() 
				RETURN d as document
			`,
			{
				"uuid": id 
			});
	},

	async create(document) {
		var data = await neo('WRITE',
			`
			CREATE (d:Document)
			SET d = $props,
			d.dateCreated = TIMESTAMP(),
			d.dateEdit = TIMESTAMP(),
			d.dateConsult = TIMESTAMP()
			RETURN d as document
			`,
			{
				"props": document.json
			});

			if(data != undefined) {
				document.uuid = data.records[0].get('document').properties.uuid;
				return document;
			} else {
				// lève une exception
			}
	},

	edit(document) {
			await neo('WRITE',
			`
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

	delete(id) {
		await neo('WRITE',
		`
		MATCH (d:Document) WHERE d.uuid = $uuid
		DELETE d
		`,
		{
			"uuid": id,
		});
	}
}


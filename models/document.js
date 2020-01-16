const neo4j = require('../db').neo4j;
const neoDriver = require('../db').driver;

module.exports = {

	getDocumentById(id) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
		MATCH (doc:Document)
		WHERE doc.uuid = $uuid
		RETURN doc
			`,
				{
					"uuid": id 
				})
				.then(result => { // INFO: You must put RETURN n.label AS label -> get('label'), otherwise if RETURN n.label -> get('n.label')

					let data;

					// NOTE: Much simplier :D copy properties object into data!!
					// INFO: non extistent properties are not included
					if (result.records.length >= 1 ) data = result.records[0].get('doc').properties;

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

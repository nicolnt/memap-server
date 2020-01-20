const neo4j = require('../db').neo4j;
const neoDriver = require('../db').driver;

module.exports = {

	getCloseNetworkByNeuronId(id) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
			MATCH (center:Neuron {uuid: $uuid})-[r]-n:Neuron)
			WITH {
				type: TYPE(r),
    		from: STARTNODE(r).uuid
			} AS relationship, n
			RETURN n, relationship
			`,
				{
					"uuid": id 
				})
				.then(result => {

					let data = [];
					if (result.records.length >= 1 ) {
						result.records.forEach(node => {
							data.push({
								neuron: node.get('n').properties, // NOTE: properties because n is a Node
								relationship: node.get('relationship') // Here relationship is already a JSON object
							})
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
	},
	getAllSelectedNeurons() {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
			MATCH (n:Neuron:SELECTED)
			OPTIONAL MATCH (neuron)-[:HAS_TAG]->(tag:Tag)
			OPTIONAL MATCH (tag)-[:HAS_ICON]->(iTag:Icon)
			OPTIONAL MATCH (neuron)-[:HAS_TYPE]->(type:Type)
			OPTIONAL MATCH (type)-[:HAS_ICON]->(iType:Icon)
			OPTIONAL MATCH (neuron)-[:HAS_ICON]->(icon:Icon)
			OPTIONAL MATCH (neuron)-[:HAS_FILE]->(file:File)
			OPTIONAL MATCH (neuron)-[:HAS_DOCUMENT]->(document:Document)
			RETURN { 
				neuron:neuron, 
				tags: COLLECT(DISTINCT tag.properties), 
				type: type.properties,
				type_icon: iType.properties,
				icon:icon, 
				selected: "SELECTED" IN LABELS(neuron), 
				favorite:"FAVORITE" IN LABELS(neuron), 
				documents: COLLECT(DISTINCT document), 
				files: COLLECT(DISTINCT file) 
			} AS myNeuron
			`)
				.then(result => {

					let data = result.records;
					if (result.records.length >=1 ) {
						data = data.map(neuron =>  {
							return neuron.get('myNeuron');
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
	},
	getAllOrphanNeurons() {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
			MATCH (neuron:Neuron) WHERE NOT (neuron)--(:Neuron)
			OPTIONAL MATCH (neuron)-[:HAS_TAG]->(tag:Tag)
			OPTIONAL MATCH (tag)-[:HAS_ICON]->(iTag:Icon)
			OPTIONAL MATCH (neuron)-[:HAS_TYPE]->(type:Type)
			OPTIONAL MATCH (type)-[:HAS_ICON]->(iType:Icon)
			OPTIONAL MATCH (neuron)-[:HAS_ICON]->(icon:Icon)
			OPTIONAL MATCH (neuron)-[:HAS_FILE]->(file:File)
			OPTIONAL MATCH (neuron)-[:HAS_DOCUMENT]->(document:Document)
			RETURN { 
				neuron:neuron, 
				tags: COLLECT(DISTINCT tag.properties), 
				type: type.properties,
				type_icon: iType.properties,
				icon:icon, 
				selected: "SELECTED" IN LABELS(neuron), 
				favorite:"FAVORITE" IN LABELS(neuron), 
				documents: COLLECT(DISTINCT document), 
				files: COLLECT(DISTINCT file) 
			} AS myNeuron
			`)
				.then(result => {

					let data = result.records;
					if (result.records.length >=1 ) {
						data = data.map(neuron =>  {
							return neuron.get('myNeuron');
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
	},
	getAllFavoriteNeurons() {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
			MATCH (neuron:Neuron:FAVORITE)
			OPTIONAL MATCH (neuron)-[:HAS_TAG]->(tag:Tag)
			OPTIONAL MATCH (tag)-[:HAS_ICON]->(iTag:Icon)
			OPTIONAL MATCH (neuron)-[:HAS_TYPE]->(type:Type)
			OPTIONAL MATCH (type)-[:HAS_ICON]->(iType:Icon)
			OPTIONAL MATCH (neuron)-[:HAS_ICON]->(icon:Icon)
			OPTIONAL MATCH (neuron)-[:HAS_FILE]->(file:File)
			OPTIONAL MATCH (neuron)-[:HAS_DOCUMENT]->(document:Document)
			RETURN { 
				neuron:neuron, 
				tags: COLLECT(DISTINCT tag.properties), 
				type: type.properties,
				type_icon: iType.properties,
				icon:icon, 
				selected: "SELECTED" IN LABELS(neuron), 
				favorite:"FAVORITE" IN LABELS(neuron), 
				documents: COLLECT(DISTINCT document), 
				files: COLLECT(DISTINCT file) 
			} AS myNeuron
			`)
				.then(result => {

					let data = result.records;
					if (result.records.length >=1 ) {
						data = data.map(neuron =>  {
							return neuron.get('myNeuron');
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
	},
	unselectAllNeurons() {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (n:Neuron:SELECTED)
			REMOVE n:SELECTED
			`)
				.then(result => {

					let data = result.summary.counters.updates();
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
	createRelationship(uuidFrom, uuidTo, type) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
			MATCH (from:Neuron {uuid: $rel.uuidFrom})
			MATCH (to:Neuron {uuid: $rel.uuidTo})
			WITH from, to
			FOREACH( t IN CASE WHEN $rel.type = "parent" THEN [1] ELSE [] END | 
					CREATE (from)-[r:IS_PARENT]->(to) )
			WITH from, to
			FOREACH( t IN CASE WHEN $rel.type = "friend" THEN [1] ELSE [] END | 
					CREATE (from)-[r:IS_FRIEND]->(to) )
			RETURN from, to
			`,
				{
					"rel": {
						type,
						uuidFrom,
						uuidTo
					}
				})
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) {
						data.from = result.records[0].get('from').properties;
						data.to = result.records[0].get('to').properties;
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

	deleteRelationship(uuidFrom, uuidTo, type) {
		type = "IS_"+type.toUpperCase();
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
			MATCH (from:Neuron {uuid: $uuidFrom})-[r]-(to:Neuron {uuid: $uuidTo})
			WHERE TYPE(r) = $type
			DELETE r
			RETURN from, to
			`,
				{
					type,
					uuidFrom,
					uuidTo
				})
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) {
						data.from = result.records[0].get('from').properties;
						data.to = result.records[0].get('to').properties;
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

const neo4j = require('./db').neo4j;
const neoDriver = require('./db').driver;

//const neuronDB = require('../database/neuron');

/**
 * @description External function that recovers data for complex neuron data retrieval.
 * It aims at keeping the API calls straightforward.
 */
function extractNeuronData(record) {
	let data = {  };
	data.neuron = record.get('neuron').properties;
	data.tags = record.get('tags').map(tag => { return tag.properties });
	data.documents = record.get('documents').map(doc => { return doc.properties });
	data.files = record.get('files').map(file => { return file.properties });
	data.documents = record.get('documents').map(doc => { return doc.properties });
	data.favorite = record.get('favorite');
	data.selected = record.get('selected');

	const icon = record.get('icon'); 
	if (icon)
		data.icon = icon.properties;

	const type = record.get('type'); 
	if (type) {
		data.type = type.properties;
		const type_icon = record.get('type_icon');
		if (type_icon) 
			data.type.icon = type_icon.properties;
	}

	return data;
}
function extractNeuronBubbleData(record) {
	let data = record.get('neuron').properties;
	data.favorite = record.get('favorite');
	data.selected = record.get('selected');

	const icon = record.get('icon'); 
	if (icon)
		data.icon = icon.properties;
	else
		data.icon = null

	return data;
}


module.exports = {
	getNeuronUUIDByID(idNeuron) {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			return session.run(`
			MATCH (neuron:Neuron)
			WHERE ID(neuron) = $id
			RETURN neuron.uuid AS uuid
			`,
				{
					id: idNeuron
				})
				.then(result => {
					let data = { };
					if (result.records.length >= 1 )
						data = result.records[0].get('uuid');
					return data;
				})
			.catch(error => Promise.reject( error ))
			.finally(() => session.close());
	},
	getNeuronByID(id) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
			MATCH (neuron:Neuron) WHERE ID(neuron) = $id
			OPTIONAL MATCH (neuron)-[:HAS_TAG]->(tag:Tag)
			OPTIONAL MATCH (tag)-[:HAS_ICON]->(iTag:Icon)
			OPTIONAL MATCH (neuron)-[:HAS_TYPE]->(type:Type)
			OPTIONAL MATCH (type)-[:HAS_ICON]->(iType:Icon)
			OPTIONAL MATCH (neuron)-[:HAS_ICON]->(icon:Icon)
			OPTIONAL MATCH (neuron)-[:HAS_FILE]->(file:File)
			OPTIONAL MATCH (neuron)-[:HAS_DOCUMENT]->(document:Document)
			RETURN { 
				tags: COLLECT(DISTINCT tag), 
				type: type,
				type_icon: iType,
				icon:icon, 
				selected: "SELECTED" IN LABELS(neuron), 
				favorite:"FAVORITE" IN LABELS(neuron), 
				documents: COLLECT(DISTINCT document), 
				files: COLLECT(DISTINCT file) 
			} AS myNeuron, neuron
			`,
				{
					id
				})
				.then(result => {
					let data = {};
					if (result.records.length >= 1 ) {
						data = result.records[0].get('myNeuron');
						data.tags = data.tags.map(tag => { return tag.properties });
						data.documents = data.documents.map(document => { return document.properties });
						data.files = data.files.map(files => { return files.properties });
						data.neuron = result.records[0].get('neuron').properties;
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
	getNeuronBubbleByUUIDIfChangedAfterTimestamp(uuidNeuron, timestamp) {
		timestamp = parseInt(timestamp);
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
			MATCH (neuron:Neuron {uuid: $uuid})
			WHERE neuron.dateEdited > $timestamp
			OPTIONAL MATCH (neuron)-[:HAS_ICON]->(icon:Icon)

			RETURN neuron, icon,
			"SELECTED" IN LABELS(neuron) AS selected,
			"FAVORITE" IN LABELS(neuron) AS favorite
			`,
				{
					uuid: uuidNeuron,
					timestamp
				})
				.then(result => {
					let data;
					if (result.records.length >= 1 )
						data = extractNeuronBubbleData(result.records[0]);
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
	getNeuronBubbleByUUID(uuid) {
		const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });

		return session.run(`
			MATCH (neuron:Neuron {uuid: $uuid})
			OPTIONAL MATCH (neuron)-[:HAS_ICON]->(icon:Icon)

			RETURN neuron, icon,
			"SELECTED" IN LABELS(neuron) AS selected,
			"FAVORITE" IN LABELS(neuron) AS favorite
			`,
			{
				uuid
			})
			.then(result => {
				let data = {}; // TODO try without initializing data so it is returned as undefined.
				if (result.records.length >= 1 )
					data = extractNeuronBubbleData(result.records[0]);
				return data;
			})
			.catch(error => Promise.reject(error))
			.finally(() => session.close());
	},
	getNeuronByUUIDIfChangedAfterTimestamp(uuidNeuron, timestamp) {
		timestamp = parseInt(timestamp);
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
			MATCH (neuron:Neuron {uuid: $uuid})
			WHERE neuron.dateEdited > $timestamp
			OPTIONAL MATCH (neuron)-[:HAS_TAG]->(tag:Tag)
			OPTIONAL MATCH (tag)-[:HAS_ICON]->(iTag:Icon)
			OPTIONAL MATCH (neuron)-[:HAS_TYPE]->(type:Type)
			OPTIONAL MATCH (type)-[:HAS_ICON]->(iType:Icon)
			OPTIONAL MATCH (neuron)-[:HAS_ICON]->(icon:Icon)
			OPTIONAL MATCH (neuron)-[:HAS_FILE]->(file:File)
			OPTIONAL MATCH (neuron)-[:HAS_DOCUMENT]->(document:Document)

			RETURN neuron, type, icon, iType AS type_icon,
			COLLECT(DISTINCT tag) AS tags,
			"SELECTED" IN LABELS(neuron) AS selected,
			"FAVORITE" IN LABELS(neuron) AS favorite,
			COLLECT(DISTINCT document) AS documents,
			COLLECT(DISTINCT file) AS files
			`,
				{
					uuid: uuidNeuron,
					timestamp
				})
				.then(result => {
					let data;
					if (result.records.length >= 1 )
						data = extractNeuronData(result.records[0]);
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
	getNeuronByUUID(uuid) {
		const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });

		return session.run(`
			MATCH (neuron:Neuron {uuid: $uuid})
			OPTIONAL MATCH (neuron)-[:HAS_TAG]->(tag:Tag)
			OPTIONAL MATCH (tag)-[:HAS_ICON]->(iTag:Icon)
			OPTIONAL MATCH (neuron)-[:HAS_TYPE]->(type:Type)
			OPTIONAL MATCH (type)-[:HAS_ICON]->(iType:Icon)
			OPTIONAL MATCH (neuron)-[:HAS_ICON]->(icon:Icon)
			OPTIONAL MATCH (neuron)-[:HAS_FILE]->(file:File)
			OPTIONAL MATCH (neuron)-[:HAS_DOCUMENT]->(document:Document)

			RETURN neuron, type, icon, iType AS type_icon,
			COLLECT(DISTINCT tag) AS tags,
			"SELECTED" IN LABELS(neuron) AS selected,
			"FAVORITE" IN LABELS(neuron) AS favorite,
			COLLECT(DISTINCT document) AS documents,
			COLLECT(DISTINCT file) AS files
			`,
			{
				uuid
			})
			.then(result => {
				let data = {}; // TODO try without initializing data so it is returned as undefined.
				if (result.records.length >= 1 )
					data = extractNeuronData(result.records[0]);
				return data;
			})
			.catch(error => Promise.reject(error))
			.finally(() => session.close());
	},
	deleteByUUID(uuid) {
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
	unfavoriteNeuronByUUID(uuid) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (n:Neuron:FAVORITE {uuid: $uuid})
			SET n.dateEdited = TIMESTAMP()
			REMOVE n:FAVORITE
			RETURN n AS neuron
			`,
				{
					uuid
				})
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
	favoriteNeuronByUUID(uuid) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (n:Neuron {uuid: $uuid})
			SET n.dateEdited = TIMESTAMP()
			SET n:FAVORITE
			RETURN n AS neuron
			`,
				{
					uuid
				})
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
	unselectNeuronByUUID(uuid) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (n:Neuron:SELECTED {uuid: $uuid})
			SET n.dateEdited = TIMESTAMP()
			REMOVE n:SELECTED
			RETURN n AS neuron
			`,
				{
					uuid
				})
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
	toggleFavoriteNeuronByUUID(uuid) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (n:Neuron {uuid: $uuid})
			SET n.dateEdited = TIMESTAMP()
			WITH n
			CALL apoc.do.when("FAVORITE" IN LABELS(n), "REMOVE n:FAVORITE", "SET n:FAVORITE", {n:n}) YIELD value RETURN value
			`,
				{
					uuid
				})
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
	toggleSelectNeuronByUUID(uuid) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (n:Neuron {uuid: $uuid})
			SET n.dateEdited = TIMESTAMP()
			WITH n
			CALL apoc.do.when("SELECTED" IN LABELS(n), "REMOVE n:SELECTED", "SET n:SELECTED", {n:n}) YIELD value RETURN value
			`,
				{
					uuid
				})
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
	selectNeuronByUUID(uuid) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (n:Neuron {uuid: $uuid})
			SET n:SELECTED
			SET n.dateEdited = TIMESTAMP()
			RETURN n AS neuron
			`,
				{
					uuid
				})
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
	renameByUUID(uuid, name) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (n:Neuron {uuid: $uuid})
			SET n.name = $name
			SET n.dateEdited = TIMESTAMP()
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
	changeColor(uuid, newColor) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (n:Neuron {uuid: $uuid})
			SET n.color = $newColor
			SET n.dateEdited = TIMESTAMP()
			RETURN n AS neuron
			`, {
				uuid,
				newColor
			} )
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
	changeIconByFAname(uuid, fontAwesomeIcon) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (neuron:Neuron {uuid: $uuid})
			OPTIONAL MATCH (neuron)-[r:HAS_ICON]->(i:Icon)
			DELETE r
			WITH neuron
			SET neuron.dateEdited = TIMESTAMP(),
			neuron.iconFontAwesome = $fontAwesomeIcon
			RETURN neuron
			`, {
				uuid,
				fontAwesomeIcon
			} )
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) data = result.records[0].get('neuron').properties.iconFontAwesome;
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
	changeIconByUUID(uuid, iconUUID) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (neuron:Neuron {uuid: $uuid})
			OPTIONAL MATCH (neuron)-[r:HAS_ICON]->(i:Icon)
			DELETE r

			WITH neuron

			MATCH (icon:Icon {uuid: $iconUUID})
			CREATE (neuron)-[r:HAS_ICON]->(icon)
			SET neuron.dateEdited = TIMESTAMP()
			REMOVE neuron.iconFontAwesome
			RETURN icon
			`, {
				uuid,
				iconUUID
			} )
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) data = result.records[0].get('icon').properties;
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
	changeType(uuid, typeName) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (neuron:Neuron {uuid: $uuid})
			OPTIONAL MATCH (neuron)-[r:HAS_TYPE]->(t:Type)
			DELETE r

			WITH neuron

			MATCH (type:Type {name: $typeName})
			CREATE (neuron)-[r:HAS_TYPE]->(type)
			SET neuron.dateEdited = TIMESTAMP()

			RETURN type
			`, {
				uuid,
				typeName
			} )
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
	removeSingleTag(uuid, tagName) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (neuron:Neuron {uuid: $uuid})
			MATCH (tag:Tag {name: $tagName})
			OPTIONAL MATCH (neuron)-[r:HAS_TAG]->(tag)
			SET neuron.dateEdited = TIMESTAMP()
			DELETE r
			`, {
				uuid,
				tagName
			} )
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
	removeDocument(uuid, documentUUID) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (neuron:Neuron {uuid: $uuid})
			MATCH (d:Document {uuid: $documentUUID})
			OPTIONAL MATCH (neuron)-[r:HAS_DOCUMENT]->(d)
			DELETE r
			SET neuron.dateEdited = TIMESTAMP()
			RETURN neuron, d AS document
			`, {
				uuid,
				documentUUID
			} )
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
	removeFile(uuid, fileUUID) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (neuron:Neuron {uuid: $uuid})
			MATCH (file:File {uuid: $fileUUID})
			OPTIONAL MATCH (neuron)-[r:HAS_FILE]->(file)
			DELETE r
			SET neuron.dateEdited = TIMESTAMP()
			RETURN neuron, file
			`, {
				uuid,
				fileUUID
			} )
				.then(result => {

					let data = result.summary.counters.updates();
					/*
					if (result.records.length >= 1 ) {
						data.file = result.records[0].get('file').properties;
						data.neuron = result.records[0].get('neuron').properties;
					}
					*/

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
	addDocument(uuid, documentUUID) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (neuron:Neuron {uuid: $uuid})
			MATCH (d:Document {uuid: $documentUUID})
			MERGE (neuron)-[r:HAS_DOCUMENT]->(d)
			SET neuron.dateEdited = TIMESTAMP()
			RETURN neuron, d AS document
			`, {
				uuid,
				documentUUID
			} )
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) {
						data.document = result.records[0].get('document').properties;
						data.neuron = result.records[0].get('neuron').properties;
					}
					data.summary = result.summary.counters.updates();

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
	addFile(uuid, fileUUID) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (neuron:Neuron {uuid: $uuid})
			MATCH (file:File {uuid: $fileUUID})
			MERGE (neuron)-[r:HAS_FILE]->(file)
			SET neuron.dateEdited = TIMESTAMP()
			RETURN neuron, file
			`, {
				uuid,
				fileUUID
			} )
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) {
						data.file = result.records[0].get('file').properties;
						data.neuron = result.records[0].get('neuron').properties;
					}
					data.summary = result.summary.counters.updates();

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
	editTags(uuid, tags) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (neuron:Neuron {uuid: $uuid})
			OPTIONAL MATCH (neuron)-[r:HAS_TAG]->(t:Tag)
			DELETE r

			WITH neuron

			UNWIND $tags AS t
			MATCH (tag:Tag {name: t.name})
			CREATE (neuron)-[r:HAS_TAG]->(tag)
			SET neuron.dateEdited = TIMESTAMP()

			RETURN tag
			`, {
				uuid,
				tags
			} )
				.then(result => {

					let data = result.records;
					if (result.records.length >= 1 ) {
						data = result.records.map(node => {
							var object = node.get('tag').properties;
							return object; 
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
	/**
	 * @returns Newly created neuron internal Neo4j ID (not yet UUID)
	 */
	// NOTE Removed return Promise as Neo4j driver already does this for us.
	// replaced last then by finally to make sure we clause the session when we're done.
	createNeuron(neuronProperties) {
		const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });

		return session.run(`
		CREATE (neuron:Neuron)
			SET neuron = $neuronProperties,
			neuron.dateCreated = TIMESTAMP(),
			neuron.dateEdited = TIMESTAMP(),
			neuron.dateConsulted = TIMESTAMP()
			RETURN ID(neuron) AS id
			`, {
				neuronProperties 
			})
			.then(result => {
				let data = {  };
				if (result.records.length >= 1 ) data.id = result.records[0].get('id');
				return data;
			})
			.catch(error => Promise.reject( error ))
			.finally(() => session.close());
	}
}

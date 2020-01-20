const neo4j = require('../db').neo4j;
const neoDriver = require('../db').driver;

module.exports = {

	getNeuronUUIDByID(id) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
		MATCH (neuron:Neuron)
		WHERE ID(neuron) = $id
		RETURN neuron.uuid AS uuid
			`,
				{
					id
				})
				.then(result => {

					let data = {};

					if (result.records.length >= 1 ) data = result.records[0].get('uuid');

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
	getNeuronByID(id) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`

			MATCH (neuron:Neuron) WHERE ID(neuron) = $id
				OPTIONAL MATCH (neuron)-[:HAS_TAG]->(tag:Tag)
					OPTIONAL MATCH (tag)-[:HAS_ICON]->(iTag:Icon)
        			WITH { name:tag.name, icon:iTag } AS tag, neuron
				OPTIONAL MATCH (neuron)-[:HAS_TYPE]->(type:Type)
					OPTIONAL MATCH (type)-[:HAS_ICON]->(iType:Icon)
        			WITH { name: type.name, color: type.color, icon:iType } AS type, tag, neuron
				OPTIONAL MATCH (neuron)-[:HAS_ICON]->(icon:Icon)
                OPTIONAL MATCH (neuron)-[:HAS_FILE]->(file:File)
				OPTIONAL MATCH (neuron)-[:HAS_DOCUMENT]->(document:Document)


				RETURN { 
					neuron:neuron, 
					tags: COLLECT(DISTINCT tag), 
					type:type,
					icon:icon, 
					selected: "SELECTED" IN LABELS(neuron), 
					favorite:"FAVORITE" IN LABELS(neuron), 
					documents: COLLECT(DISTINCT document), 
					files: COLLECT(DISTINCT file) 
				} AS myNeuron
			`,
				{
					id
				})
				.then(result => {

					let data = {};

					if (result.records.length >= 1 ) data = result.records[0].get('myNeuron');
					if (data.tags[0].name === null) delete data.tags;
					if (data.type.name === null) delete data.type;
					if (data.icon === null) delete data.icon;

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
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
			MATCH (neuron:Neuron {uuid: $uuid})
				OPTIONAL MATCH (neuron)-[:HAS_TAG]->(tag:Tag)
					OPTIONAL MATCH (tag)-[:HAS_ICON]->(iTag:Icon)
        			WITH { name:tag.name, icon:iTag } AS tag, neuron
				OPTIONAL MATCH (neuron)-[:HAS_TYPE]->(type:Type)
					OPTIONAL MATCH (type)-[:HAS_ICON]->(iType:Icon)
        			WITH { name: type.name, color: type.color, icon:iType } AS type, tag, neuron
				OPTIONAL MATCH (neuron)-[:HAS_ICON]->(icon:Icon)
                OPTIONAL MATCH (neuron)-[:HAS_FILE]->(file:File)
				OPTIONAL MATCH (neuron)-[:HAS_DOCUMENT]->(document:Document)


				RETURN { 
					neuron:neuron, 
					tags: COLLECT(DISTINCT tag), 
					type:type,
					icon:icon, 
					selected: "SELECTED" IN LABELS(neuron), 
					favorite:"FAVORITE" IN LABELS(neuron), 
					documents: COLLECT(DISTINCT document), 
					files: COLLECT(DISTINCT file) 
				} AS myNeuron
			`,
				{
					uuid
				})
				.then(result => {

					let data = {};

					if (result.records.length >= 1 ) data = result.records[0].get('myNeuron');
					if (data.tags[0].name === null) delete data.tags;
					if (data.type.name === null) delete data.type;
					if (data.icon === null) delete data.icon;

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
			MATCH (neuron:Neuron:SELECTED)
				OPTIONAL MATCH (neuron)-[:HAS_TAG]->(tag:Tag)
					OPTIONAL MATCH (tag)-[:HAS_ICON]->(iTag:Icon)
        			WITH { name:tag.name, icon:iTag } AS tag, neuron
				OPTIONAL MATCH (neuron)-[:HAS_TYPE]->(type:Type)
					OPTIONAL MATCH (type)-[:HAS_ICON]->(iType:Icon)
        			WITH { name: type.name, color: type.color, icon:iType } AS type, tag, neuron
				OPTIONAL MATCH (neuron)-[:HAS_ICON]->(icon:Icon)

				RETURN { neuron:neuron, tags: COLLECT(tag), type:type, icon:icon } AS myNeuron
			`)
				.then(result => {

					let data = result.records;
					if (result.records.length >= 1 ) {
						data = result.records.map(node => {
							node = node.get('myNeuron');
							if (node.tags[0].name === null) delete node.tags;
							if (node.type.name === null) delete node.type;
							if (node.icon === null) delete node.icon;
							return node; 
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
	getAllPinnedNeurons() {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
		MATCH (n:Neuron:PINNED)
		RETURN n AS neuron
			`)
				.then(result => {

					let data = result.records;
					if (result.records.length >= 1 ) {
						data = result.records.map(node => {
								return node.get('neuron').properties; 
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

	renameByUUID(uuid, name) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
		MATCH (n:Neuron {uuid: $uuid})
		SET n.name = $name
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
	changeIcon(uuid, iconUUID) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (neuron:Neuron {uuid: $uuid})
			OPTIONAL MATCH (neuron)-[r:HAS_ICON]->(i:Icon)
			DELETE r

			WITH neuron

			MATCH (icon:Icon {uuid: $iconUUID})
			CREATE (neuron)-[r:HAS_ICON]->(icon)

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
	removeDocument(uuid, documentUUID) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (neuron:Neuron {uuid: $uuid})
			MATCH (d:Document {uuid: $documentUUID})
			OPTIONAL MATCH (neuron)-[r:HAS_DOCUMENT]->(d)
			DELETE r
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
	createNeuron(body) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
		CREATE (neuron:Neuron)
			SET neuron = $body,
			neuron.dateCreated = TIMESTAMP(),
			neuron.dateEdited = TIMESTAMP(),
			neuron.dateConsulted = TIMESTAMP()
			RETURN ID(neuron) AS id
			`, {
				body 
			})
				.then(result => {

					let id;
					if (result.records.length >= 1 ) id = result.records[0].get('id');

					this.getNeuronByID(id).then( data => {
						resolve( data );
					}).catch(err => {
						reject(err);
					});

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

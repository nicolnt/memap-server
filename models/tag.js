const neo4j = require('./db').neo4j;
const neoDriver = require('./db').driver;

module.exports = {

	getAllTags() {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
			MATCH (t:Tag)
			OPTIONAL MATCH (t)-[:HAS_ICON]-(i:Icon)
			RETURN t AS tag, i AS icon
			`)
				.then(result => {

					let data = result.records;
					if (result.records.length >= 1 ) {
						data = result.records.map(node => {
							var object = node.get('tag').properties;
							icon = node.get('icon');
							if (icon) object.icon = icon.properties;
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
	getTagByName(name) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
			MATCH (t:Tag)
			WHERE t.name = $name
			OPTIONAL MATCH (t)-[:HAS_ICON]-(i:Icon)
			RETURN t AS tag, i AS icon
			`,
				{
					name
				})
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) {
						data = result.records[0].get('tag').properties;
						icon = result.records[0].get('icon');
						if (icon) data.icon = icon.properties;
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
	deleteAll() {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (t:Tag)
			DETACH DELETE t
			`)
				.then(result => {

					let data = {};
					if (result.summary.counters.updates().nodesDeleted <= 1) data.message = "No Tag deleted"; 
					else data.message = `${result.summary.counters.updates().nodesDeleted} Tags deleted`;
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
	renameAndChangeIcon(name, body) {
		const iconUUID = body.icon;

		delete body.icon;
		const props = body;

		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (t:Tag {name: $name})
			SET t += $props
			WITH t
			OPTIONAL MATCH (t)-[r:HAS_ICON]-(i:Icon)
			DELETE r
			WITH t
			MATCH (i:Icon {uuid: $iconUUID})
			CREATE (t)-[r:HAS_ICON]->(i)
			RETURN t AS tag, i AS icon
			`,
				{
					name,
					props,
					iconUUID
				})
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) {
						data = result.records[0].get('tag').properties;
						icon = result.records[0].get('icon');
						if (icon) data.icon = icon.properties;
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
	rename(name, body) {
		const newName = body.name;

		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (t:Tag {name: $name})
			SET t.name = $newName
			WITH t
			OPTIONAL MATCH (t)-[:HAS_ICON]-(i:Icon)
			RETURN t AS tag, i AS icon
			`,
				{
					name,
					newName
				})
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) {
						data = result.records[0].get('tag').properties;
						icon = result.records[0].get('icon');
						if (icon) data.icon = icon.properties;
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
	changeIcon(name, iconUUID) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (t:Tag {name: $name})
			OPTIONAL MATCH (t)-[r:HAS_ICON]-(i:Icon)
			DELETE r
			WITH t
      MATCH (i:Icon {uuid: $iconUUID})
			CREATE (t)-[r:HAS_ICON]->(i)
			RETURN t AS tag, i AS icon
			`,
				{
					name,
					iconUUID
				})
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) {
						data = result.records[0].get('tag').properties;
						data.icon = result.records[0].get('icon').properties; 
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
	removeIcon(name) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (t:Tag {name: $name})
			OPTIONAL MATCH (t)-[r:HAS_ICON]-(i:Icon)
			DELETE r
			RETURN t AS tag
			`,
				{
					name
				})
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) {
						data = result.records[0].get('tag').properties;
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
	createTagWithIcon(props) {

		// NOTE: Exracting the uuid from the body
		// We don't want to set it to the type properties
		iconUUID = props.icon; 
		delete props.icon;


		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MERGE (t:Tag {name: $name})
			WITH t
			OPTIONAL MATCH (t)-[r:HAS_ICON]-(i:Icon)
			DELETE r
			WITH t
			MATCH (i:Icon {uuid: $iconUUID})
			CREATE (t)-[r:HAS_ICON]->(i)
			RETURN t AS tag, i AS icon
			`,
				{
					name: props.name,
					iconUUID
				})
				.then(result => {
					if (result.records.length >= 1 ) {
						data = result.records[0].get('tag').properties;
						data.icon = result.records[0].get('icon').properties; 
						resolve( data );
					}
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
	createTagWithoutIcon(body) {
		name = body.name;

		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MERGE (t:Tag {name: $name})
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

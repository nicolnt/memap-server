const neo4j = require('./db').neo4j;
const neoDriver = require('./db').driver;

module.exports = {

	getAllTypes() {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
		MATCH (t:Type)
		OPTIONAL MATCH (t)-[:HAS_ICON]-(i:Icon)
		RETURN t AS type, i AS icon
			`)
				.then(result => {

					let data = result.records;
					if (result.records.length >= 1 ) {
						data = result.records.map(node => {
							var object = node.get('type').properties;
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
	getTypeByName(name) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
			MATCH (t:Type)
			WHERE t.name = $name
			OPTIONAL MATCH (t)-[:HAS_ICON]-(i:Icon)
			RETURN t AS type, i AS icon
			`,
				{
					name
				})
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) {
						data = result.records[0].get('type').properties;
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
	deleteAll(name) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (t:Type)
			DETACH DELETE t
			`,
				{
					name
				})
				.then(result => {

					let data = {};
					if (result.summary.counters.updates().nodesDeleted < 1) data.message = "No Type deleted"; 
					else data.message = `${result.summary.counters.updates().nodesDeleted} types deleted`;
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
	changeIcon(name, iconUUID) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (t:Type {name: $name})
			OPTIONAL MATCH (t)-[r:HAS_ICON]-(i:Icon)
			DELETE r
			WITH t
      MATCH (i:Icon {uuid: $iconUUID})
			CREATE (t)-[r:HAS_ICON]->(i)
			RETURN t AS type, i AS icon
			`,
				{
					name,
					iconUUID
				})
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) {
						data = result.records[0].get('type').properties;
						icon = result.records[0].get('icon'); 
						if (icon) data.icon = icon.properties; // TODO: unecessay check because relationship is made here
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

	changeColor(name, color) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
		MATCH (t:Type {name: $name})
		SET t.color = $color
		WITH t
		OPTIONAL MATCH (t)-[:HAS_ICON]-(i:Icon)
		RETURN t AS type, i AS icon
			`,
				{
					name,
					color
				})
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) {
						data = result.records[0].get('type').properties;
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
	removeColorAndIcon(name) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (t:Type {name: $name})
			REMOVE t.color
			WITH t
			OPTIONAL MATCH (t)-[r:HAS_ICON]-(i:Icon)
			DELETE r
			RETURN t AS type
			`,
				{
					name
				})
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) {
						data = result.records[0].get('type').properties;
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
			MATCH (t:Type {name: $name})
			OPTIONAL MATCH (t)-[r:HAS_ICON]-(i:Icon)
			DELETE r
			RETURN t AS type
			`,
				{
					name
				})
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) {
						data = result.records[0].get('type').properties;
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
	removeColor(name) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
		MATCH (t:Type {name: $name})
		REMOVE t.color
		WITH t
		OPTIONAL MATCH (t)-[:HAS_ICON]-(i:Icon)
		RETURN t AS type, i AS icon
			`,
				{
					name
				})
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) {
						data = result.records[0].get('type').properties;
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
	editNameAndColorAndIcon(name, props) {

		iconUUID = props.icon; 
		delete props.icon;

		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (t:Type {name: $name})
			SET t += $props
			WITH t
			OPTIONAL MATCH (t)-[r:HAS_ICON]-(i:Icon)
			DELETE r
			WITH t
			MATCH (i:Icon {uuid: $iconUUID})
			CREATE (t)-[r:HAS_ICON]->(i)
			RETURN t AS type, i AS icon
			`,
				{
					name,
					props,
					iconUUID
				})
				.then(result => {
					if (result.records.length >= 1 ) {
						data = result.records[0].get('type').properties;
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
	editNameAndColor(name, props) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (t:Type {name: $name})
			SET t += $props
			WITH t
			OPTIONAL MATCH (t)-[:HAS_ICON]-(i:Icon)
			RETURN t AS type, i AS icon
			`,
				{
					name,
					props
				})
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) {
						data = result.records[0].get('type').properties;
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
	rename(name, newName) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
		MATCH (t:Type {name: $name})
		SET t.name = $newName
		WITH t
		OPTIONAL MATCH (t)-[:HAS_ICON]-(i:Icon)
		RETURN t AS type, i AS icon
			`,
				{
					name,
					newName
				})
				.then(result => {

					let data = {};
					if (result.records.length >= 1 ) {
						data = result.records[0].get('type').properties;
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
	createTypeWithIcon(props) {

		// NOTE: Exracting the uuid from the body
		// We don't want to set it to the type properties
		iconUUID = props.icon; 
		delete props.icon;

		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MERGE (t:Type {name:$props.name})
			SET t = $props
			WITH t
			OPTIONAL MATCH (t)-[r:HAS_ICON]-(i:Icon)
			DELETE r
			WITH t
			MATCH (i:Icon {uuid: $iconUUID})
			CREATE (t)-[r:HAS_ICON]->(i)
			RETURN t AS type, i AS icon
			`,
				{
					props,
					iconUUID
				})
				.then(result => {
					if (result.records.length >= 1 ) {
						data = result.records[0].get('type').properties;
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
	createTypeWithoutIcon(props) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MERGE (t:Type {name:$props.name})
			SET t = $props
			RETURN t AS type
			`,
				{
					props
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

const neo4j = require('../db').neo4j;
const neoDriver = require('../db').driver;

module.exports = {

	getIconByUUID(uuid) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
			MATCH (i:Icon {uuid: $uuid})
			RETURN i AS icon
			`,
				{
					uuid
				})
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
	createIcon(icon) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			CREATE (i:Icon)
			SET i = $icon
			RETURN i AS icon
			`,
				{
					icon
				})
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
	renameIcon(uuid, name) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (i:Icon {uuid: $uuid})
			SET i.name = $name
			RETURN i AS icon
			`,
				{
					uuid,
					name
				})
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
	deleteIcon(uuid) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (i:Icon {uuid: $uuid})
			WITH i.uuid AS uuid, i.extension AS ext, i
			DELETE i
			RETURN uuid, ext
			`,
				{
					uuid
				})
				.then(result => {

					if (result.records.length >= 1 ) var path = result.records[0].get('uuid') + '.' + result.records[0].get('ext');

					resolve( path );
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

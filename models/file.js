const neo4j = require('../db').neo4j;
const neoDriver = require('../db').driver;

module.exports = {

	getFileById(id) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
		MATCH (f:File {uuid: $uuid})
		SET f.dateConsulted = TIMESTAMP()
		RETURN f AS file
			`,
				{
					"uuid": id 
				})
				.then(result => { 

					let data = {};

					if (result.records.length >= 1 ) data = result.records[0].get('file').properties;

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

	addNewFile(path, uuid, name) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
				CREATE (f:File {name:$name, path:$path, uuid: $uuid})
				SET f.dateAdded = TIMESTAMP(), f.dateConsulted = TIMESTAMP()
				RETURN f AS file
			`,
				{
					uuid,
					path,
					name
				})
				.then(result => { 

					let data = {};

					if (result.records.length >= 1 ) data = result.records[0].get('file').properties;

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
	deleteFileById(uuid) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
				MATCH (f:File {uuid: $uuid})
				WITH f.path AS path, f
				DELETE f
				RETURN path
			`,
				{
					uuid
				})
				.then(result => { 

					let data = {};

					if (result.records.length >= 1 ) data = result.records[0].get('path');

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
	renameFileById(uuid, name) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
				MATCH (f:File {uuid: $uuid})
				SET f.name = $name
				RETURN f AS file
			`,
				{
					uuid,
					name
				})
				.then(result => { 

					let data = {};

					if (result.records.length >= 1 ) data = result.records[0].get('file').properties;

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

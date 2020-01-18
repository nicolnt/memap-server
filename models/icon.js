const neo4j = require('../db').neo4j;
const neoDriver = require('../db').driver;

module.exports = {

	getIconByName(name) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
			MATCH (i:Icon {name: $name})
			RETURN i AS icon
			`,
				{
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
	editIcon(name, props) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (i:Icon {name: $name})
			SET i += $props
			RETURN i AS icon
			`,
				{
					name,
					props
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
	deleteIcon(name) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE });
			session.run(`
			MATCH (i:Icon {name: $name})
			DELETE i
			`,
				{
					name
				})
				.then(result => {

					let data = {};
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

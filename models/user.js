const neo4j = require('../db').neo4j;
const neoDriver = require('../db').driver;

module.exports = {

	authentify(login, pwd) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
				MATCH (u:User {login: $login, pwd: $pwd})
				SET u.lastConnexion = TIMESTAMP() 
				RETURN u
			`,
				{
					'login':login, 
					'pwd':pwd
				})
				.then(result => { 
					resolve(result);
				})
				.catch(error => {
					reject( error );
				})
				.then(() => {
					session.close();
				});
		});
	},

	createUser(user) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
				CREATE (u:User)
				SET u = $props,
				u.dateCreated = TIMESTAMP(),
				u.dateEdit = TIMESTAMP(),
				u.lastConnexion = TIMESTAMP()
				RETURN u
			`,
				{
					'props':user
				})
				.then(result => {
					resolve(result);
				})
				.catch(error => {
					reject( error );
				})
				.then(() => {
					session.close();
				});
		});
	},

	editUserPwd(uuid, pwd) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
				MATCH (u:User {uuid: $uuid})
				SET u.pwd = $pwd,
				u.dateEdit = TIMESTAMP()
				RETURN u
			`,
				{
					uuid, pwd
				})
				.then(result => { // INFO: You must put RETURN n.label AS label -> get('label'), otherwise if RETURN n.label -> get('n.label')

					let data;

					// NOTE: Much simplier :D copy properties object into data!!
					// INFO: non extistent properties are not included
					if (result.records.length >= 1 ) data = result.records[0].get('d').properties;

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

	deleteUser(uuid) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE});
			session.run(`
				MATCH (u:User {uuid: $uuid})
				DELETE u
			`,
				{
					uuid
				})
				.then(result => {
				    resolve();
				})
				.catch(error => {
					reject(error);
				})
				.then(() => {
					session.close();
				});
		});
	}
}


const neo4j = require('./db').neo4j;
const neoDriver = require('./db').driver;

module.exports = {

	async authentify(user) {
		const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
		var result = await session.run(`
			MATCH (u:User {login: $login, pwd: $pwd})
			SET u.lastConnexion = TIMESTAMP() 
			RETURN u
		`,
		{
			'login': user.login, 
			'pwd': user.pwd
		})
		if(result.records.lengh < 0) {
			resolve(result);
		}	
	},

	async create(user) {
		const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
		await session.run(`
			CREATE (u:User)
			SET u = $props,
			u.dateCreated = TIMESTAMP(),
			u.lastConnexion = TIMESTAMP()
			RETURN u
			`,
			{
				'props':user
			})
	},

	async edit(user) {
		const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
		session.run(`
			MATCH (u:User {uuid: $uuid})
			SET u.pwd = $pwd,
			u.dateEdit = TIMESTAMP()
			RETURN u
		`,
			{
			'uuid': user.uuid, 
			'pwd': user.pwd
			})
			if (result.records.length >= 1 )
			data = result.records[0].get('d').properties;
			resolve( data );
	},

	async delete(user) {
		const session = neoDriver.session({ defaultAccessMode: neo4j.session.WRITE});
		await session.run(`
			MATCH (u:User {uuid: $uuid})
			DELETE u
		`,
		{
			'uuid': user.uuid
		})
	}
}


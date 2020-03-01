

const neo4j = require('neo4j-driver');
const driver = neo4j.driver(
	'bolt://localhost:7687',
	neo4j.auth.basic('neo4j', 'admin'), // NOTE: username, pwd
	
	// NOTE: check this for more details: 
	// https://github.com/neo4j/neo4j-javascript-driver#reading-integers
	{ disableLosslessIntegers: true }); 


module.exports.neo4j = neo4j;
module.exports.driver = driver;
module.exports.neo = async (mode, req, params) => {

    const session = driver.session({ defaultAccessMode: neo4j.session[mode] });
    return await session.run(req, params)
	}
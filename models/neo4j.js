const neo4j = require('../db').neo4j;
const neoDriver = require('../db').driver;

module.exports = async (mode, req, params) => {
    const session = neoDriver.session({ defaultAccessMode: neo4j.session[mode] });
    return await session.run(req, params)
}
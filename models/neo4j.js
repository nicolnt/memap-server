const {neo4j, driver} = require('../db');

module.exports = async (mode, req, params) => {
    const session = driver.session({ defaultAccessMode: neo4j.session[mode] });
    return await session.run(req, params)
}
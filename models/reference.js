const neo4j = require('./db').neo;

module.exports = {

	async get(reference) {
		return await neo4j('READ', 
		`
			MATCH (r:Reference) WHERE r.uuidPage = $uuidPage AND r.url = $url AND r.idRef = $idRef
			RETURN r AS reference
		`,
		{
			'uuidPage': reference.uuidPage,
			'url': reference.url,
			'idRef': reference.idRef 
		})
    },

    async create(reference) {
		return await neo4j('WRITE', 
		`
			CREATE (r:Reference)
			SET r = $props,
			r.cache = $cache,
			r.dateCreated = TIMESTAMP(),
			r.dateEdit = TIMESTAMP()
			RETURN r
		`,
		{
			"props": reference.json,
			"cache": reference.content
		})
    },

	 async edit(reference) {
		return await neo4j('WRITE', 
		`
			MATCH (r:Reference) WHERE r.uuidPage = $uuidPage AND r.url = $url AND r.idRef = $idRef
            SET r.cache = $cache
            RETURN r
		`,
		{
			"uuidPage": reference.uuidPage,
			"url": reference.url,
			"idRef": reference.idRef,
			"cache": reference.cache
		})
    },

    async deleteByPage(uuidPage) {
		return await neo4j('WRITE', 
		`
			MATCH (r:Reference) WHERE r.uuidPage = $uuidPage
			DELETE r
		`,
		{
			"uuidPage": uuidPage
		})
	},

	async deleteById(reference) {
		return await neo4j('WRITE', 
		`
			MATCH (r:Reference) WHERE r.uuidPage = $uuidPage AND r.url = $url AND r.idRef = $idRef
			DELETE r
		`,
		{
			"uuidPage": reference.uuidPage,
			"url": reference.url,
			"idRef": reference.idRef
		})
	}
}
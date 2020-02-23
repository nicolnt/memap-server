const neo4j = require('./neo4j');

module.exports = {

	get(reference) {
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

    create(reference) {
		return await neo4j('WRITE', 
		`
			CREATE (r:Reference)
			SET r = $props,
			r.content = $content,
			r.dateCreated = TIMESTAMP(),
			r.dateEdit = TIMESTAMP()
			RETURN r
		`,
		{
			"props": reference.json,
			"content": JSON.stringify(reference.content)
		})
    },

    edit(reference) {
		return await neo4j('WRITE', 
		`
			MATCH (r:Reference) WHERE r.uuidPage = $uuidPage AND r.url = $url AND r.idRef = $idRef
            SET r.content = $content
            RETURN r
		`,
		{
			"uuidPage": reference.uuidPage,
			"url": reference.url,
			"idRef": reference.idRef,
			"content": reference.content
		})
    },

    deleteByPage(uuidPage) {
		return await neo4j('WRITE', 
		`
			MATCH (r:Reference) WHERE r.uuidPage = $uuidPage
			DELETE r
		`,
		{
			"uuidPage": uuidPage
		})
	},

	deleteById(reference) {
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
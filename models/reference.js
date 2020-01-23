const neo4j = require('../db').neo4j;
const neoDriver = require('../db').driver;

module.exports = {

	getReference(body) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
			MATCH (r:Reference) WHERE r.uuidPage = $uuidPage AND r.url = $url AND r.idRef = $idRef
			RETURN r AS reference
			`,
				{
                    "uuidPage": body.uuidPage,
                    "url": body.url,
                    "idRef": body.idRef 
                })
				.then(result => { 
					resolve(result.records);
				})
				.catch(error => {
					reject( error );
				})
				.then(() => {
					session.close();
				});

		});
    },

    createReference(body, content) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
            CREATE (r:Reference)
            SET r = $props,
            r.content = $content,
            r.dateCreated = TIMESTAMP(),
            r.dateEdit = TIMESTAMP()
            RETURN r
            `,
				{
                    "props": body,
                    "content": JSON.stringify(content)
                })
				.then(result => { 
					if (result.records.length >= 1 ) resolve();
					else reject();
				})
				.catch(error => {
					reject( error );
				})
				.then(() => {
					session.close();
				});

		});
    },

    editReference(body) {

		return new Promise((resolve, reject) => {
            const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
			MATCH (r:Reference) WHERE r.uuidPage = $uuidPage AND r.url = $url AND r.idRef = $idRef
            SET r += $content
            RETURN r
			`,
				{
                    "uuidPage": body.uuidPage,
                    "url": body.url,
                    "idRef": body.idRef,
                    "content": JSON.stringify(body.content)
                })
				.then(result => { 
				  resolve();
				})
				.catch(error => {
					reject( error );
				})
				.then(() => {
					session.close();
				});

		});
    },

    deleteReferenceByPage(body) {
		return new Promise((resolve, reject) => {
			const session = neoDriver.session({ defaultAccessMode: neo4j.session.READ });
			session.run(`
			MATCH (r:Reference) WHERE r.uuidPage = $uuidPage
			DELETE r
			`,
				{
                    "uuidPage": uuidPage
                })
				.then(result => { 
				  resolve();
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
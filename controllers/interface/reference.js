const Reference = require('../CRUD/Reference');

module.exports = {
    getExt(req, res) {
        let reference = new Reference(req.body);
        await Reference.$searchExt(reference)
        res.status(200).send({
            'state': reference.state,
            'content': reference.content,
            'updated': reference.updated,
            'cache': reference.cache
        })
    }, 
    getPage(req, res) {
        const content = await Reference.$searchPage(req.body.url);
        res.status(200).send({
            'content':content
        })
    }, 

    getInt(req, res) {
        let reference = new Reference(req.body);
        await Reference.$searchInt(reference)
        res.status(200).send({
            'state': reference.state,
            'content': reference.content,
            'updated': reference.updated,
            'cache': reference.cache
        })
    },
    edit(req, res) {
        let reference = new Reference(req.body);
        await Reference.$edit(reference)
    },
    delete(req, res) {
        await Reference.$delete(req.params.id);
        res.status(200).send({});
    }
}


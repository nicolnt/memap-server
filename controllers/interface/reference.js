const Reference = require('../CRUD/Reference');
const checkIn = require('../../helpers/checkIn');

module.exports = {
    async getExt(req, res) {
        checkIn.isRequire(req.body, ['uuidPage', 'url', 'idRef']);
        let reference = new Reference(req.body);
        await Reference.$searchExt(reference)
        res.status(200).send({
            'state': reference.state,
            'content': reference.content,
            'updated': reference.updated,
            'cache': reference.cache
        })
    }, 
    async getPage(req, res) {
        checkIn.isRequire(req.body, ['url']);
        const content = await Reference.$searchPage(req.body.url);
        res.status(200).send({
            'content':content
        })
    }, 

    async getInt(req, res) {
        checkIn.isRequire(req.body, ['uuidPage', 'url', 'idRef']);
        let reference = new Reference(req.body);
        await Reference.$searchInt(reference)
        res.status(200).send({
            'state': reference.state,
            'content': reference.content,
            'updated': reference.updated,
            'cache': reference.cache
        })
    },
    async edit(req, res) {
        checkIn.isRequire(req.body, ['uuidPage', 'url', 'idRef', 'cache']);
        let reference = new Reference(req.body);
        await Reference.$edit(reference)
        res.status(200).send({});
    },
    async delete(req, res) {
        await Reference.$delete(req.params.id);
        res.status(200).send({});
    }
}


const DataClass = require('./DataClass.js');
const db = require('../../models/neode.js');

module.exports = class Document extends DataClass {
    /////// Database label ////////
    static label = 'Document'

    /////// Configuration ////////
    constructor(data) {
        super(data,
            {
                uuid: [],
                title: ['isString'],
                content: ['isString'],
                createAt: [],
                editAt: [],
                consultAt: []
            });
    }
    
    /////// CRUD ////////
    static $getByUuid = async (uuid) => {
        let result = await db.find(this.label, uuid)
        return (result) ? result.properties() : false
    }

    static $getAll = async () => await (await db.all(this.label)).map((v) => v.properties())

    static $create = async (document) => await db.create(this.label, {...document.json, createAt:new Date})

    static $update = async (document) => await db.merge(this.label, {...document.json, editAt:new Date})

    static $delete = async (document) => (await db.find(this.label, document.uuid)).delete()
};
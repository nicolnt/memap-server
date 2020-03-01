const DataClass = require('./DataClass.js');
const documentModel = require('../../models/document.js');
const db = require('../../models/neode.js');

module.exports = class Document extends DataClass {
    static label = 'Document'

    constructor(data) {
        super();

        this.configuration =
        {
            uuid: [],
            title: [this.isString],
            content: [this.isString],
            dateCreated: [],
            dateEdit: [],
            dateConsult: [],
        }

        this.build();
        this.hydrate(data);   
    }
    
    /////// CRUD ////////
    static async $getByUuid(uuid) {
        return (await db.find(this.label, uuid)).properties();
    }

    static async $getAll() {
        const result = await db.all(this.label)
        return await result.map((v) => {
            return v.properties();
        })
    }

    static async $update(document) {
        db.merge(this.label, document.json);
    }

    static async $delete(document) {
        (await db.find(this.label, document.uuid)).delete()
    }

    static async $create(document) {
        db.create(this.label, document.json);
    }
};
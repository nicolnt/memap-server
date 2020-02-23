const DataClass = require('./DataClass.js');
const documentModel = require('../../models/document.js');

module.exports = class Document extends DataClass {
    
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
         const result = await documentModel.getDocumentByUuid(uuid);
         return result.records[0].get('document').properties;
    }

    static async $getAll() {

        const result = await documentModel.getAll();
        let documentList = [];
        result.records.forEach(element => {
            documentList.push(element.get('document').properties);
        });
        return documentList;
    }

    static async $update(document) {
        documentModel.edit(document);
    }

    static async $delete(document) {
        documentModel.delete(document.uuid);
    }

    static async $create(document) {
        documentModel.create(document);
    }
};
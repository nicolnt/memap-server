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
        return new Document(await documentModel.getDocumentByUuid(uuid));
    }

    static async $getAll() {
        var result = await documentModel.getAll();
        var documentList = [];
        result.records.forEach(element => {
            documentList.push(new Document(element.get('document').properties));
        });
        return documentList;
    }

    static async $update(document) {
        documentModel.edit(document);
    }

    static async $delete(document) {
        if(document.uuid != undefined) {
            documentModel.delete(document.uuid);
        } else {
            // exception
        }  
    }

    static async $create(document) {
        documentModel.create(document);
    }
};
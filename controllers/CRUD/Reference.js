const DataClass = require('./DataClass.js');
const referenceModel = require('../../models/reference.js');

const rp = require('request-promise');
const $ = require('cheerio');

module.exports = class Reference extends DataClass {
    
    constructor(data) {
        super();

        this.configuration =
        {
            idRef: [],
            uuidPage: [],
            cache: [this.isString],
            url: [],
            dateCreated: [],
            dateEdit: []
        }

        this.build();
        this.hydrate(data);   
    }


    /////// CRUD ////////
    static async $searchExt(reference) {
        reference.content = $('#' + req.body.idRef, await rp(req.body.url)).html();
        reference.state = (reference.content != null) ? 'good' : 'noIdRef';
        await Reference.get(reference);
    }

    static async $get(reference) {
        let result = await referenceModel.get(reference);
        if(result.records.length < 1) {
            reference.cache = reference.content;
            Reference.create(reference);
        } else {
            reference.updated = (reference.state == 'good' && 
                JSON.parse(result.records[0].get('reference').properties.content) != content) ? true : false;
        }
    }


    static async $searchInt(reference) {
        const result = await Document.$getByUuid(reference.uuidPage);
        if (result.length < 1) {
            reference.content = $('#' + req.body.idRef, result.record[0].get('document').properties.content).html();
            reference.state = (reference.content != null) ? 'good' : 'noIdRef';
        } else {
            reference.state = "noUrl";
        }
        await Reference.get(reference);
    }

    static async $authentify(reference) {
        referenceModel.authentify(new Reference(reference));
    }

    static async $update(reference) {
        return referenceModel.edit(reference);
    }

    static async $delete(reference) {
        if(reference.uuid != undefined) {
            referenceModel.delete(reference.uuid);
        } else {
            // exception
        }  
    }

    static async $create(reference) {
        referenceModel.create(reference);
    }
};
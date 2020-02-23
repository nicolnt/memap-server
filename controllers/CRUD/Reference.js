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
        reference.content = $('#' + reference.idRef, await rp(reference.url)).html();
        reference.state = (reference.content != null) ? 'good' : 'noIdRef';
        await Reference.$get(reference);
    }

    static async $get(reference) {
        let result = await referenceModel.get(reference);
        if(result.records.length < 1) {
            Reference.$create(reference);
            reference.updated = false;
        } else if(result.records[0].get('reference').properties.content != reference.content) {
            reference.cache = result.records[0].get('reference').properties.content;
            reference.updated = true;
        } else {
            reference.updated = false;
        }
    }

    static async $searchPage(url) {
        let content = $.load(await rp(url));
        content('*').each(function() {
            if($(this).attr('id') == undefined) {
                $(this).addClass("no-referencing");
            } else {
                $(this).addClass("referencing");
            }
        
        })
        return content.html();
    }

    static async $searchInt(reference) {
        const result = await Document.$getByUuid(reference.uuidPage);
        if (result.length < 1) {
            reference.content = $('#' + reference.idRef, result.record[0].get('document').properties.content).html();
            reference.state = (reference.content != null) ? 'good' : 'noIdRef';
        } else {
            reference.state = "noUrl";
        }
        await Reference.$get(reference);
    }

    static async $edit(reference) {
        await referenceModel.edit(reference);
    }

    static async $delete(reference) {
        await referenceModel.delete(reference.uuid);
    }

    static async $create(reference) {
        await referenceModel.create(reference);
    }
};
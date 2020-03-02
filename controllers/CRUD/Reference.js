const DataClass = require('./DataClass.js');
const Document = require('./Document.js');
const db = require('../../models/neode.js');

const rp = require('request-promise');
const $ = require('cheerio');

module.exports = class Reference extends DataClass {
    /////// Database label ////////
    static label = 'Reference'

    constructor(data) {
        super(data,
            {
                uuidPage: [],
                url: [],
                idRef: [],
                cache: ['isString'],
                createAt: [],
                editAt: []
            });
    }


    /////// CRUD ////////
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

    static async $searchExt(reference) {
        reference.content = $('#' + reference.idRef, await rp(reference.url)).html();
        reference.state = (reference.content != null) ? 'good' : 'noIdRef';
        await Reference.$get(reference);
    }

    static async $searchInt(reference) {
        const result = await Document.$getByUuid(reference.uuidPage);
        if (result) {
            reference.content = $('#' + reference.idRef, result.content).html();
            reference.state = (reference.content != null) ? 'good' : 'noIdRef';
        } else {
            reference.state = "noUrl";
        }
        await Reference.$get(reference);
    }

    static async $get(reference) {
        let result = await db.first(this.label, reference.json);
        if(!result) {
            reference.cache = reference.content
            Reference.$create(reference);
            reference.updated = false;
        } else if(result.properties().cache != reference.content) {
            reference.cache = result.properties().content;
            reference.updated = true;
        } else {
            reference.updated = false;
        }
    }

    static $create = async (reference) => await db.create(this.label, {...reference.json, createdAt:new Date})

    static $edit = async (reference) => await db.merge(this.label, {...reference.json, editAt:new Date})

    static $delete = async (reference) => (await db.find(this.label, reference.json)).delete()
};
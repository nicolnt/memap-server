const rp = require('request-promise');
const $ = require('cheerio');

const reference_model = require('../models/reference');
const document_model = require('../models/document');

module.exports = {
    write: {
        getExternRef(req, res) {
            rp(req.body.url)
            .then((html) => {
                console.log(html)
                reference_model.getReference(req.body).then((data) => {
                    let content = $('#' + req.body.idRef, html).html();

                    if(data.length == 0) {
                        if(content != null) {
                            reference_model.createReference(req.body, content);
                            res.status(200);
                            res.send({'state' : 'good', 'message' : '', 'content' : content, 'updated' : false});
                        } else {
                            res.status(200);
                            res.send({'state' : 'noIdRef', 'message' : 'L\'id specifié ne pointe sur aucun de la page spécifié.', 'content' : '', 'updated' : false});
                        }
                    } else if (JSON.parse(data[0].get('reference').properties.content) != content) {
                        res.status(200);
                        res.send({'state' : 'good', 'message' : '', 'content' : content, 'updated' : true, 'cache' : JSON.parse(data[0].get('reference').properties.content)});
                    } else {
                        res.status(200);
                        res.send({'state' : 'good', 'message' : '', 'content' : content, 'updated' : false});
                    }
                })
            })
            .catch(function(response){
                if(response.error.code == 'ENOTFOUND') {
                    res.status(200);
                    res.send({'state' : 'noUrl', 'message' : 'L\'url de la référence specifié n\'ai pas correct.', 'content' : '', 'updated' : false});
                } else {
                    res.status(500);
                    res.end();
                }
            });
        }, 
        getInternRef(req, res) {
            document_model.getDocumentById(req.body.idPageRef).then((data) => { 
                reference_model.getReference(req.body).then((ref) => {
                    let content = $('#' + req.body.idRef, data.content).html();
                    console.log(content);
                    if(ref.length == 0) {
                        if(content != null) {
                            reference_model.createReference(req.body, content);
                            res.status(200);
                            res.send({'state' : 'good', 'message' : '', 'content' : content, 'updated' : false});
                        } else {
                            res.status(200);
                            res.send({'state' : 'noIdRef', 'message' : 'L\'id specifié ne pointe sur aucun de la page spécifié.', 'content' : '', 'updated' : false});
                        }
                    } else if (JSON.parse(ref[0].get('reference').properties.content) != content) {
                        res.status(200);
                        res.send({'state' : 'good', 'message' : '', 'content' : content, 'updated' : true, 'cache' : JSON.parse(ref[0].get('reference').properties.content)});
                    } else {
                        res.status(200);
                        res.send({'state' : 'good', 'message' : '', 'content' : content, 'updated' : false});
                    }
                });
            });
        },
        editRef(req, res) {
                reference_model.editReference(req.body).then((data) => {
                    res.status(200);
                    res.send("edited");
                })
            .catch(function(err){
                console.log(err)
                res.status(500);
                res.end();
            });
        }
    }
}


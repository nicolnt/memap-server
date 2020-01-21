const rp = require('request-promise');

module.exports = {
    write: {
        getExternRef(req, res, next) {
            console.log(req.body)
            /*
            rp(req.body.lol)
            .then(function(html){
                res.status(200);
                res.send(html);
            })
            .catch(function(err){
                res.status(500);
                res.end();
            });
            */
           res.status(200);
           res.send('ok');
        }
    }
}


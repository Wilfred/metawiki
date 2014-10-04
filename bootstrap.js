var fs = require("fs");
var async = require('async');
var db = require('./db.js');

db.connect();

function createResource(resourcePath, localPath, cb) {
    db.Resource.findOneAndUpdate({
        category: 'template',
        path: resourcePath
    }, {
        content: fs.readFileSync(localPath, {encoding: 'utf8'})
    }, {
        upsert: true
    }, cb);
}

async.parallel([
    function(cb) {
        createResource("index.html", "index.html", cb);
    },
], function(err, res) {
    db.disconnect();
});

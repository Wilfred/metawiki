var fs = require("fs");
var async = require('async');
var db = require('./db.js');

db.connect();

function createResource(resourcePath, localPath) {
    return function(cb) {
        db.Resource.findOneAndUpdate({
            category: 'template',
            path: resourcePath
        }, {
            content: fs.readFileSync(localPath, {encoding: 'utf8'})
        }, {
            upsert: true
        }, cb);
    }
}

async.parallel([
    createResource("index.html", "index.html"),

    // TODO: treat css as a separate type of content.
    createResource("css/codemirror.css",
                   "bower_components/codemirror/lib/codemirror.css"),
], function(err, res) {
    db.disconnect();
});

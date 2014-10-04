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

    // TODO: treat css and js as separate types of content.
    createResource("css/codemirror.css",
                   "bower_components/codemirror/lib/codemirror.css"),
    createResource("js/codemirror/codemirror.js",
                   "bower_components/codemirror/lib/codemirror.js"),
    createResource("js/codemirror/javascript.js",
                   "bower_components/codemirror/mode/javascript/javascript.js"),
    
    createResource("js/wikieval/start_editor.js",
                   "static/start_editor.js"),
], function(err, res) {
    db.disconnect();
});

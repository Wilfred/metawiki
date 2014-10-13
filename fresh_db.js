var fs = require("fs");
var async = require('async');
var db = require('./db.js');

function createResource(category, resourcePath, localPath) {
    return function(cb) {
        db.Resource.findOneAndUpdate({
            category: category,
            path: resourcePath
        }, {
            content: fs.readFileSync(localPath, {encoding: 'utf8'})
        }, {
            upsert: true
        }, cb);
    }
}

async.series([
    // Remove all existing resources, install a fresh set, and cleanup.
    function(cb) {
        db.connect(cb);
    },
    function(cb) {
        db.Resource.remove({}, cb);
    }, function(cb) {
        async.parallel([
            createResource("html", "index.html", "index.html"),

            // TODO: treat css and js as separate types of content.
            createResource("css", "codemirror.css",
                           "bower_components/codemirror/lib/codemirror.css"),
            createResource("js", "codemirror/codemirror.js",
                           "bower_components/codemirror/lib/codemirror.js"),
            createResource("js", "codemirror/javascript.js",
                           "bower_components/codemirror/mode/javascript/javascript.js"),
            
            createResource("js", "routie/routie.js",
                           "bower_components/routie/dist/routie.js"),
            
            createResource("js", "jquery/jquery.js",
                           "bower_components/jquery/dist/jquery.js"),
            
            createResource("js", "uri/uri.js",
                           "bower_components/uri.js/src/URI.js"),
            
            createResource("js", "marked/marked.js",
                           "bower_components/marked/lib/marked.js"),
            
            createResource("js", "handlebars/handlebars.js",
                           "bower_components/handlebars/handlebars.js"),
            
            createResource("js", "wikieval/start_editor.js",
                           "static/start_editor.js"),
            createResource("js", "wikieval/app.js",
                           "static/app.js"),

            createResource("md", "Home",
                           "static/Home.md")
        ], cb);
    }, function(cb) {
        db.disconnect(cb);
    }
], function(err, res) {
    if (err) {
        console.log(['Failed:', err]);
    } else {
        console.log('Done.');
    }
});

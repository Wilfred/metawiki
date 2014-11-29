var fs = require("fs");
var async = require('async');
var db = require('./db.js');
var models = require('./models.js');

function createResource(category, mimeType, resourcePath, localPath) {
    return function(cb) {
        models.Resource.findOneAndUpdate({
            category: category,
            path: resourcePath
        }, {
            mimeType: mimeType,
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
        models.Resource.remove({}, cb);
    }, function(cb) {
        async.parallel([
            createResource("html", "test/html",
                           "index.html", "index.html"),

            createResource("css", "text/css",
                           "codemirror.css",
                           "bower_components/codemirror/lib/codemirror.css"),
            createResource("js", "application/javascript",
                           "codemirror/codemirror.js",
                           "bower_components/codemirror/lib/codemirror.js"),
            createResource("js", "application/javascript",
                            "codemirror/javascript.js",
                           "bower_components/codemirror/mode/javascript/javascript.js"),
            
            createResource("js", "application/javascript",
                            "routie/routie.js",
                           "bower_components/routie/dist/routie.js"),
            
            createResource("js", "application/javascript",
                            "jquery/jquery.js",
                           "bower_components/jquery/dist/jquery.js"),
            
            createResource("js", "application/javascript",
                            "marked/marked.js",
                           "bower_components/marked/lib/marked.js"),
            
            createResource("js", "application/javascript",
                            "handlebars/handlebars.js",
                           "bower_components/handlebars/handlebars.js"),
            
            createResource("js", "application/javascript",
                            "wikieval/start_editor.js",
                           "static/start_editor.js"),
            createResource("js", "application/javascript",
                            "wikieval/app.js",
                           "static/app.js"),

            createResource("md", "text/plain",
                           "Home",
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

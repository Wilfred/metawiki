var fs = require("fs");
var async = require('async');
var db = require('./db.js');
var models = require('./models.js');

var total = 0;

function createResource(mimeType, resourcePath, localPath) {
    return function(cb) {
        models.Resource.findOneAndUpdate({
            path: resourcePath
        }, {
            mimeType: mimeType,
            content: fs.readFileSync(localPath, {encoding: 'utf8'})
        }, {
            upsert: true
        }, cb);
        total++;
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
            createResource("test/html",
                           "html/index.html", "index.html"),

            createResource("text/css",
                           "css/codemirror.css",
                           "bower_components/codemirror/lib/codemirror.css"),
            createResource("application/javascript",
                           "js/codemirror/codemirror.js",
                           "bower_components/codemirror/lib/codemirror.js"),
            createResource("application/javascript",
                            "js/codemirror/javascript.js",
                           "bower_components/codemirror/mode/javascript/javascript.js"),
            
            createResource("application/javascript",
                            "js/routie/routie.js",
                           "bower_components/routie/dist/routie.js"),
            
            createResource("application/javascript",
                            "js/jquery/jquery.js",
                           "bower_components/jquery/dist/jquery.js"),
            
            createResource("application/javascript",
                            "js/marked/marked.js",
                           "bower_components/marked/lib/marked.js"),
            
            createResource("application/javascript",
                            "js/handlebars/handlebars.js",
                           "bower_components/handlebars/handlebars.js"),
            
            createResource("application/javascript",
                            "js/wikieval/app.js",
                           "static/app.js"),

            createResource("text/plain",
                           "md/Home",
                           "static/Home.md")
        ], cb);
    }, function(cb) {
        db.disconnect(cb);
    }
], function(err, res) {
    if (err) {
        console.log(['Failed:', err]);
    } else {
        console.log(['Created/updated:', total]);
    }
});

var fs = require("fs");
var async = require('async');
var db = require('./db.js');
var models = require('./models.js');

var total = 0;

// TODO: use an opts object.
function createResource(mimeType, resourcePath, localPath) {
    return function(cb) {
        models.Resource.findOneAndUpdate({
            path: resourcePath
        }, {
            mimeType: mimeType,
            content: fs.readFileSync(localPath, {
                encoding: 'utf8'
            })
        }, {
            upsert: true
        }, cb);
        total++;
    };
}

function createBinaryResource(opts) {
    return function(cb) {
        models.Resource.findOneAndUpdate({
            path: opts.path
        }, {
            mimeType: opts.mimeType,
            localPath: opts.localPath
        }, {
            upsert: true
        }, cb);
        total++;
    };

}

async.series([
    // Remove all existing resources, install a fresh set, and cleanup.
    db.connect,
    function(cb) {
        models.Resource.remove({}, cb);
    },
    function(cb) {
        async.parallel([
            createResource("text/html",
                "html/index.html",
                "src/frontend/index.html"),

            createBinaryResource({
                path: "logo.jpg",
                mimeType: "image/jpeg",
                localPath: "ouroboros.jpg"
            }),

            createResource("text/css",
                "css/codemirror.css",
                "bower_components/codemirror/lib/codemirror.css"),
            createResource("application/javascript",
                "js/codemirror/codemirror.js",
                "bower_components/codemirror/lib/codemirror.js"),
            createResource("application/javascript",
                "js/codemirror/matchbrackets.js",
                "bower_components/codemirror/addon/edit/matchbrackets.js"),
            createResource("application/javascript",
                "js/codemirror/javascript.js",
                "bower_components/codemirror/mode/javascript/javascript.js"),
            createResource("application/javascript",
                "js/codemirror/markdown.js",
                "bower_components/codemirror/mode/markdown/markdown.js"),
            createResource("application/javascript",
                "js/codemirror/xml.js",
                "bower_components/codemirror/mode/xml/xml.js"),
            createResource("application/javascript",
                "js/codemirror/css.js",
                "bower_components/codemirror/mode/css/css.js"),

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
                "js/wikicircle/app.js",
                "src/frontend/app.js"),

            createResource("text/css",
                "js/wikicircle/wikicircle.css",
                "src/frontend/wikicircle.css"),

            createResource("text/x-markdown",
                "md/Home",
                "src/frontend/Home.md")
        ], cb);
    },
    db.disconnect
], function(err, res) {
    if (err) {
        console.log(['Failed:', err]);
    } else {
        console.log(['Created/updated:', total]);
    }
});
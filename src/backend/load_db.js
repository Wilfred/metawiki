"use strict"; 

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
            }),
            bootstrapPath: localPath
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
                "js/codemirror/lib/codemirror.js",
                "bower_components/codemirror/lib/codemirror.js"),

            createResource("application/javascript",
                "js/codemirror/addon/edit/matchbrackets.js",
                "bower_components/codemirror/addon/edit/matchbrackets.js"),

            createResource("application/javascript",
                "js/codemirror/mode/javascript/javascript.js",
                "bower_components/codemirror/mode/javascript/javascript.js"),
            createResource("application/javascript",
                "js/codemirror/mode/meta.js",
                "bower_components/codemirror/mode/meta.js"),
            createResource("application/javascript",
                "js/codemirror/mode/markdown/markdown.js",
                "bower_components/codemirror/mode/markdown/markdown.js"),
            createResource("application/javascript",
                "js/codemirror/mode/xml/xml.js",
                "bower_components/codemirror/mode/xml/xml.js"),
            createResource("application/javascript",
                "js/codemirror/mode/css/css.js",
                "bower_components/codemirror/mode/css/css.js"),

            createResource("application/javascript",
                "js/routie/routie.js",
                "bower_components/routie/dist/routie.js"),

            createResource("application/javascript",
                "js/requirejs/require.js",
                "bower_components/requirejs/require.js"),

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
                "js/wikicircle/routing.js",
                "src/frontend/routing.js"),
            createResource("application/javascript",
                "js/wikicircle/models.js",
                "src/frontend/models.js"),
            createResource("application/javascript",
                "js/wikicircle/controllers.js",
                "src/frontend/controllers.js"),
            createResource("application/javascript",
                "js/wikicircle/templates.js",
                "src/frontend/templates.js"),
            createResource("application/javascript",
                "js/wikicircle/app.js",
                "src/frontend/app.js"),

            createResource("text/css",
                "js/wikicircle/wikicircle.css",
                "src/frontend/wikicircle.css"),

            createResource("text/x-markdown",
                           "md/Home",
                           "src/frontend/Home"),
            createResource("text/x-markdown",
                           "md/Bugs",
                           "src/frontend/Bugs"),
            createResource("text/x-markdown",
                           "md/Challenges",
                           "src/frontend/Challenges"),
            createResource("text/x-markdown",
                           "md/Bugs",
                           "src/frontend/Bugs"),
            createResource("text/x-markdown",
                           "md/Related",
                           "src/frontend/Related"),
            createResource("text/x-markdown",
                           "md/Security",
                           "src/frontend/Security"),
        ], cb);
    },
    db.disconnect
], function(err, res) {
    if (err) {
        console.log(['Failed:', err]);
    } else {
        console.log('Created/updated %s resources.', total);
    }
});

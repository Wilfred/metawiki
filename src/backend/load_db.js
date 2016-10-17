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
            created: Date.now(),
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
            created: Date.now(),
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
            createBinaryResource({
                path: "logo.jpg",
                mimeType: "image/jpeg",
                localPath: "ouroboros.jpg"
            }),

            createResource("text/css",
                "codemirror/lib/codemirror.css",
                "node_modules/codemirror/lib/codemirror.css"),
            createResource("application/javascript",
                "codemirror/lib/codemirror.js",
                "node_modules/codemirror/lib/codemirror.js"),

            createResource("application/javascript",
                "codemirror/addon/edit/closebrackets.js",
                "node_modules/codemirror/addon/edit/closebrackets.js"),
            createResource("application/javascript",
                "codemirror/addon/edit/matchbrackets.js",
                "node_modules/codemirror/addon/edit/matchbrackets.js"),
            createResource("application/javascript",
                "codemirror/addon/selection/active-line.js",
                "node_modules/codemirror/addon/selection/active-line.js"),

            createResource("application/javascript",
                "codemirror/mode/javascript/javascript.js",
                "node_modules/codemirror/mode/javascript/javascript.js"),
            createResource("application/javascript",
                "codemirror/mode/meta.js",
                "node_modules/codemirror/mode/meta.js"),
            createResource("application/javascript",
                "codemirror/mode/markdown/markdown.js",
                "node_modules/codemirror/mode/markdown/markdown.js"),
            createResource("application/javascript",
                "codemirror/mode/xml/xml.js",
                "node_modules/codemirror/mode/xml/xml.js"),
            createResource("application/javascript",
                "codemirror/mode/css/css.js",
                "node_modules/codemirror/mode/css/css.js"),

            createResource("application/javascript",
                "requirejs/require.js",
                "node_modules/requirejs/require.js"),

            createResource("application/javascript",
                "backbone.js",
                "node_modules/backbone/backbone.js"),

            createResource("application/javascript",
                "underscore.js",
                "node_modules/underscore/underscore.js"),

            createResource("application/javascript",
                "jquery.js",
                "node_modules/jquery/dist/jquery.js"),

            createResource("application/javascript",
                "marked/marked.js",
                "node_modules/marked/lib/marked.js"),

            createResource("application/javascript",
                "handlebars/handlebars.js",
                "node_modules/handlebars/dist/handlebars.js"),

            createResource("application/javascript",
                "mocha/mocha.js",
                "node_modules/mocha/mocha.js"),
            createResource("text/css",
                "mocha/mocha.css",
                "node_modules/mocha/mocha.css"),

            createResource("text/html",
                "metawiki/index.html",
                "src/frontend/index.html"),

            createResource("application/javascript",
                "metawiki/routing.js",
                "src/frontend/routing.js"),
            createResource("application/javascript",
                "metawiki/models.js",
                "src/frontend/models.js"),
            createResource("application/javascript",
                "metawiki/controllers.js",
                "src/frontend/controllers.js"),
            createResource("application/javascript",
                "metawiki/templates.js",
                "src/frontend/templates.js"),
            createResource("application/javascript",
                "metawiki/editor.js",
                "src/frontend/editor.js"),
            createResource("application/javascript",
                "metawiki/app.js",
                "src/frontend/app.js"),

            createResource("text/css",
                "metawiki/metawiki.css",
                "src/frontend/metawiki.css"),

            createResource("text/x-markdown",
                           "page/Home",
                           "src/frontend/Home"),
            createResource("text/x-markdown",
                           "page/Bugs",
                           "src/frontend/Bugs"),
            createResource("text/x-markdown",
                           "page/Challenges",
                           "src/frontend/Challenges"),
            createResource("text/x-markdown",
                           "page/Bugs",
                           "src/frontend/Bugs"),
            createResource("text/x-markdown",
                           "page/Related",
                           "src/frontend/Related"),
            createResource("text/x-markdown",
                           "page/Security",
                           "src/frontend/Security"),
            createResource("text/x-markdown",
                           "page/Design",
                           "src/frontend/Design"),
        ], cb);
    },
    db.disconnect
], function(err) {
    if (err) {
        console.log(['Failed:', err]);
    } else {
        console.log('Created/updated %s resources.', total);
    }
});

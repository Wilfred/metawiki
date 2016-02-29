"use strict"; 

var fs = require("fs");
var async = require('async');
var db = require('./db.js');
var models = require('./models.js');

var total = 0;

function createResource(opts) {
    return function(cb) {
        var resource = new models.Resource({
            mimeType: opts.mimeType,
            content: fs.readFileSync(opts.localPath, {
                encoding: 'utf8'
            }),
            path: opts.resourcePath,
            bootstrapPath: opts.localPath
        });
        resource.save(cb);

        total++;
    };
}

function createBinaryResource(opts) {
    return function(cb) {
        var resource = new models.Resource({
            path: opts.path,
            mimeType: opts.mimeType,
            localPath: opts.localPath
        });
        resource.save(cb);

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

            createResource({
                mimeType: "text/css",
                resourcePath: "codemirror/lib/codemirror.css",
                localPath: "node_modules/codemirror/lib/codemirror.css"
            }),
            createResource({
                mimeType: "application/javascript",
                resourcePath: "codemirror/lib/codemirror.js",
                localPath: "node_modules/codemirror/lib/codemirror.js"
            }),

            createResource({
                mimeType: "application/javascript",
                resourcePath: "codemirror/addon/edit/closebrackets.js",
                localPath: "node_modules/codemirror/addon/edit/closebrackets.js"
            }),
            createResource({
                mimeType: "application/javascript",
                resourcePath: "codemirror/addon/edit/matchbrackets.js",
                localPath: "node_modules/codemirror/addon/edit/matchbrackets.js"
            }),
            createResource({
                mimeType: "application/javascript",
                resourcePath: "codemirror/addon/selection/active-line.js",
                localPath: "node_modules/codemirror/addon/selection/active-line.js"
            }),

            createResource({
                mimeType: "application/javascript",
                resourcePath: "codemirror/mode/javascript/javascript.js",
                localPath: "node_modules/codemirror/mode/javascript/javascript.js"
            }),
            createResource({
                mimeType: "application/javascript",
                resourcePath: "codemirror/mode/meta.js",
                localPath: "node_modules/codemirror/mode/meta.js"
            }),
            createResource({
                mimeType: "application/javascript",
                resourcePath: "codemirror/mode/markdown/markdown.js",
                localPath: "node_modules/codemirror/mode/markdown/markdown.js"
            }),
            createResource({
                mimeType: "application/javascript",
                resourcePath: "codemirror/mode/xml/xml.js",
                localPath: "node_modules/codemirror/mode/xml/xml.js"
            }),
            createResource({
                mimeType: "application/javascript",
                resourcePath: "codemirror/mode/css/css.js",
                localPath: "node_modules/codemirror/mode/css/css.js"
            }),

            createResource({
                mimeType: "application/javascript",
                resourcePath: "requirejs/require.js",
                localPath: "node_modules/requirejs/require.js"
            }),

            createResource({
                mimeType: "application/javascript",
                resourcePath: "backbone.js",
                localPath: "node_modules/backbone/backbone.js"
            }),

            createResource({
                mimeType: "application/javascript",
                resourcePath: "underscore.js",
                localPath: "node_modules/underscore/underscore.js"
            }),

            createResource({
                mimeType: "application/javascript",
                resourcePath: "jquery.js",
                localPath: "node_modules/jquery/dist/jquery.js"
            }),

            createResource({
                mimeType: "application/javascript",
                resourcePath: "marked/marked.js",
                localPath: "node_modules/marked/lib/marked.js"
            }),

            createResource({
                mimeType: "application/javascript",
                resourcePath: "handlebars/handlebars.js",
                localPath: "node_modules/handlebars/dist/handlebars.js"
            }),

            createResource({
                mimeType: "application/javascript",
                resourcePath: "mocha/mocha.js",
                localPath: "node_modules/mocha/mocha.js"
            }),
            createResource({
                mimeType: "text/css",
                resourcePath: "mocha/mocha.css",
                localPath: "node_modules/mocha/mocha.css"
            }),

            createResource({
                mimeType: "text/html",
                resourcePath: "metawiki/index.html",
                localPath: "src/frontend/index.html"
            }),

            createResource({
                mimeType: "application/javascript",
                resourcePath: "metawiki/routing.js",
                localPath: "src/frontend/routing.js"
            }),
            createResource({
                mimeType: "application/javascript",
                resourcePath: "metawiki/models.js",
                localPath: "src/frontend/models.js"
            }),
            createResource({
                mimeType: "application/javascript",
                resourcePath: "metawiki/controllers.js",
                localPath: "src/frontend/controllers.js"
            }),
            createResource({
                mimeType: "application/javascript",
                resourcePath: "metawiki/templates.js",
                localPath: "src/frontend/templates.js"
            }),
            createResource({
                mimeType: "application/javascript",
                resourcePath: "metawiki/editor.js",
                localPath: "src/frontend/editor.js"
            }),
            createResource({
                mimeType: "application/javascript",
                resourcePath: "metawiki/app.js",
                localPath: "src/frontend/app.js"
            }),

            createResource({
                mimeType: "text/css",
                resourcePath: "metawiki/metawiki.css",
                localPath: "src/frontend/metawiki.css"
            }),

            createResource({
                mimeType: "text/x-markdown",
                resourcePath: "page/Home",
                localPath: "src/frontend/Home"
            }),
            createResource({
                mimeType: "text/x-markdown",
                resourcePath: "page/Bugs",
                localPath: "src/frontend/Bugs"
            }),
            createResource({
                mimeType: "text/x-markdown",
                resourcePath: "page/Challenges",
                localPath: "src/frontend/Challenges"
            }),
            createResource({
                mimeType: "text/x-markdown",
                resourcePath: "page/Bugs",
                localPath: "src/frontend/Bugs"
            }),
            createResource({
                mimeType: "text/x-markdown",
                resourcePath: "page/Related",
                localPath: "src/frontend/Related"
            }),
            createResource({
                mimeType: "text/x-markdown",
                resourcePath: "page/Security",
                localPath: "src/frontend/Security"
            }),
            createResource({
                mimeType: "text/x-markdown",
                resourcePath: "page/Design",
                localPath: "src/frontend/Design"
            }),
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

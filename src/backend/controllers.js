"use strict";

var restify = require('restify');
var path = require('path');
var fs = require('fs');

var Handlebars = require('handlebars');
var _ = require('underscore');

var models = require('./models');


function index(req, response, next) {
    response.setHeader('Content-Type', 'text/html');

    var path = "metawiki/index.html";
    models.Resource.findOne({
        'path': path
    }, function(err, indexResource) {
        if (indexResource === null) {
            fetchTemplate("index_missing.html", function(err, template) {
                if (err) {
                    // TODO: proper logging.
                    console.log(err);
                    throw err;
                }

                response.writeHead(404);

                response.end(template({
                    path: path
                }));
            });
            
        } else {
            response.writeHead(200);
            response.end(indexResource.content);
        }
        
        next();
    });
}

function serve(request, response, next) {
    var urlPath = request.params[0];

    models.Resource.findOne({
        'path': urlPath
    }, function(err, resource) {
        if (resource === null) {
            // TODO: should be JSON with an error reason.
            next(new restify.NotFoundError(
                "No resource with path '" + urlPath + "'"));
        } else {
            response.writeHead(200, {
                'Content-Type': resource.mimeType + "; charset=UTF-8"
            });

            if (resource.content) {
                response.write(resource.content);
                response.end();
            } else if (resource.localPath) {
                // TODO: store both text and binary in mongo
                var appDir = path.dirname(require.main.filename);
                var absPath = path.join(appDir, "..", "..", "binary_files",
                                        resource.localPath);

                // TODO: unit test to verify we don't allow directory
                // travel if localPath contains '..'.
                fs.readFile(absPath, function(err, data) {
                    if (err) throw err; // TODO: HTTP 500/404 as appropriate

                    response.write(data);
                    response.end();
                });
            }
            next();
        }
    });
}

function getResource(req, res, next) {
    var path = req.params.path;

    models.Resource.findOne({
        'path': path
    }, function(err, resource) {
        if (resource === null) {
            next(new restify.NotFoundError(
                "No resource with path '" + path + "'"));
        } else {
            res.send(resource);
            next();
        }
    });
}

function updateResource(req, res, next) {
    var path = req.params.path;

    if (!_.isString(req.body.content) || !_.isString(req.body.mimeType)) {
        next(new restify.BadRequestError(
            "You need to provide a body and a mimeType."));
        next();
    }

    models.Resource.findOneAndUpdate({
        'path': path
    }, {
        content: req.body.content,
        mimeType: req.body.mimeType
    }, function(err, resource) {
        if (resource === null) {
            next(new restify.NotFoundError(
                "No resource with path '" + path + "'"));
        } else {
            res.send(resource);
            next();
        }
    });
}

function createResource(req, res, next) {
    var path = req.params.path;

    models.Resource.findOne({
        'path': path
    }, function(err, existingResource) {
        if (existingResource === null) {
            var resource = new models.Resource({
                path: path,
                content: req.body.content
            });
            resource.save(function() {
                // TODO: should we send something else?
                res.send(resource);
                next();
            });
        } else {
            next(new restify.BadRequestError(
                "Resource with path '" + path + "' already exists."));
            next();
        }
    });
}

function allResources(req, res, next) {
    models.Resource.find({}, function(err, resources) {
        res.send(resources);
        next();
    });
}

function fetchTemplate(name, cb) {
    fs.readFile(path.join(__dirname, "templates", name), {
        encoding: 'utf8'
    }, function(err, templateSrc) {
        if (err) {
            cb(err, null);
        }

        var template;
        try {
            template = Handlebars.compile(templateSrc);
        } catch(e) {
            cb(err, null);
        }

        cb(null, template);
    });
}

function safeViewAllResources(request, response, next) {
    response.setHeader('Content-Type', 'text/html');

    models.Resource.find({}).sort('path').exec(function(err, resources) {

        fetchTemplate("safe_view_all.html", function(err, template) {
            if (err) {
                // TODO: proper logging.
                console.log(err);
                throw err;
            }

            response.end(template({
                resources: resources
            }));
            next();
        });
    });
}

function safeViewResource(request, response, next) {
    var resourcePath = request.params[0];
    
    response.setHeader('Content-Type', 'text/html');

    models.Resource.findOne({
        'path': resourcePath
    }, function(err, resource) {
        fetchTemplate("safe_view.html", function(err, template) {
            if (err) {
                // TODO: proper logging.
                console.log(err);
                throw err;
            }

            response.writeHead(resource ? 200 : 404);
            response.end(template({
                resourceStr: JSON.stringify(resource, null, 4),
                resource: resource,
                resourcePath: resourcePath
            }));
            next();
        });
    });
}

module.exports = {
    serve: serve,
    
    getResource: getResource,
    createResource: createResource,
    updateResource: updateResource,
    allResources: allResources,

    safeViewAllResources: safeViewAllResources,
    safeViewResource: safeViewResource,
    
    index: index
};

var restify = require('restify');
var db = require('./db');


function index(req, response, next) {
    response.setHeader('Content-Type', 'text/html');
    db.Resource.findOne({'path': 'index.html'}, function(err, indexResource) {
        response.writeHead(200);
        response.end(indexResource.content);
    });
}

var CATEGORY_MIME_TYPES = {
    js: 'application/javascript',
    html: 'text/html',
    css: 'text/css'
};
var DEFAULT_MIME_TYPE = 'application/octet-stream';

function serve(request, response, next) {
    var category = request.params[0], path = request.params[1];
    
    db.Resource.findOne({
        'category': category, 'path': path
    }, function(err, resource) {
        if (resource === null) {
            next(new restify.NotFoundError(
                "No resource with path '" + path + "'"));
        } else {
            response.writeHead(200, {
                'Content-Type': CATEGORY_MIME_TYPES[resource.category] || DEFAULT_MIME_TYPE
            });
            response.write(resource.content);
            response.end();
        }
    });
}

function resource(req, res, next) {
    var category = req.params[0], path = req.params[1];
    
    db.Resource.findOne({
        'category': category, 'path': path
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

function allResources(req, res, next) {
    db.Resource.find({}, function(err, resources) {
        res.send(resources);
        next();
    });
}

module.exports = {
    serve: serve,
    resource: resource,
    allResources: allResources,
    index: index
};

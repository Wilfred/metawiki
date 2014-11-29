var restify = require('restify');
var models = require('./models');


function index(req, response, next) {
    response.setHeader('Content-Type', 'text/html');
    models.Resource.findOne({'path': 'html/index.html'}, function(err, indexResource) {
        response.writeHead(200);
        response.end(indexResource.content);
    });
}

function serve(request, response, next) {
    var path = request.params[0];
    
    models.Resource.findOne({
        'path': path
    }, function(err, resource) {
        if (resource === null) {
            next(new restify.NotFoundError(
                "No resource with path '" + path + "'"));
        } else {
            response.writeHead(200, {
                'Content-Type': resource.mimeType + "; charset=UTF-8"
            });
            response.write(resource.content);
            response.end();
        }
    });
}

function getResource(req, res, next) {
    var path = req.params[0];
    
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

function allResources(req, res, next) {
    models.Resource.find({}, function(err, resources) {
        res.send(resources);
        next();
    });
}

module.exports = {
    serve: serve,
    getResource: getResource,
    allResources: allResources,
    index: index
};

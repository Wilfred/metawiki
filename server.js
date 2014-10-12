var restify = require('restify');

var log = require('./log');
var db = require('./db');
db.connect();

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
    css: 'text/css',
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
            res.writeHead(200, {
                'Content-Type': CATEGORY_MIME_TYPES[resource.category] || 'application/octet-stream'
            });
            res.write(resource.content);
            res.end();
        }
    });
}

var APP_NAME = "WikiEval";
var server = restify.createServer({
    name: APP_NAME,
    log: log
});

server.pre(function (request, response, next) {
    request.log.info(request.method, request.url);
    next();
});

server.get('/', index);
server.get(/^\/resources\/(.+?)\/(.+)$/, resource);

server.listen(8080, function() {
    console.log('==> %s server listening at %s', server.name, server.url);
});

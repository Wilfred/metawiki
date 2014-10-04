var http = require('http');
var restify = require('restify');

var db = require('./db.js');
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
        'category': category, 'path': path,
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

var server = restify.createServer();
server.get('/', index);
server.get(/^\/resources\/(.+?)\/(.+)$/, resource);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});

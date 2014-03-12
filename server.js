var http = require('http');
var Resource = require('./resource.js');

var restify = require('restify');

function index(req, response, next) {
    response.setHeader('Content-Type', 'text/html');
    Resource.findOne({'path': 'index.html'}, function(err, indexResource) {
        response.writeHead(200);
        response.end(indexResource.content);
    });
}

function resource(req, response, next) {
    Resource.findOne({'path': req.params.path}, function(err, resource) {
        if (resource === null) {
            next(new restify.NotFoundError(
                "No resource with path '" + req.params.path + "'"));
        } else {
            response.send(resource)
        }
    })
}

var server = restify.createServer();
server.get('/', index);
server.get('/resource/:path', resource);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

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

function resource(req, response, next) {
    db.Resource.findOne({'path': req.params[0]}, function(err, resource) {
        if (resource === null) {
            next(new restify.NotFoundError(
                "No resource with path '" + req.params[0] + "'"));
        } else {
            response.send(resource.content);
        }
    })
}

var server = restify.createServer();
server.get('/', index);
server.get(/^\/resources\/(.+)/, resource);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

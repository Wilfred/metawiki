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

var server = restify.createServer();
server.get('/', index);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

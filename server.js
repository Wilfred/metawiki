var http = require('http');
var Resource = require('./resource.js');

var restify = require('restify');

function index(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    Resource.findOne({'path': 'index.html'}, function(err, indexResource) {
        res.writeHead(200);
        res.end(indexResource.content);
    });
}

var server = restify.createServer();
server.get('/', index);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

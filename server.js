var restify = require('restify');

var log = require('./log');
var db = require('./db');
db.connect();

var views = require('./views');

var APP_NAME = "WikiEval";
var server = restify.createServer({
    name: APP_NAME,
    log: log
});

server.pre(function (request, response, next) {
    request.log.info(request.method, request.url);
    next();
});

server.get('/', views.index);
server.get(/^\/resources\/(.+?)\/(.+)$/, views.resource);
server.get(/^\/resources\/$/, views.allResources);

server.listen(8080, function() {
    console.log('==> %s server listening at %s', server.name, server.url);
});

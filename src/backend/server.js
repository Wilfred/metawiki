var restify = require('restify');

var log = require('./log');

var views = require('./views');

var APP_NAME = "wikicircle";
var server = restify.createServer({
    name: APP_NAME,
    log: log
});

server.pre(function (request, response, next) {
    request.log.info(request.method, request.url);
    next();
});

server.use(restify.bodyParser({mapParams: false}));

server.get('/', views.index);
server.get(/^\/serve\/(.+?)$/, views.serve);
server.get(/^\/resources\/(.+?)$/, views.getResource);
server.put(/^\/resources\/(.+?)$/, views.updateResource);
server.get(/^\/resources\/$/, views.allResources);

module.exports = server;

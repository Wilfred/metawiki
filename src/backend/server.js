"use strict"; 

var restify = require('restify');
var _ = require('underscore');

var log = require('./log');
var controllers = require('./controllers');

function createServer(opts) {
    opts = opts || {};

    var defaultOpts = {
        name: 'wikicircle',
        log: log
    };

    opts = _.extend(defaultOpts, opts);
    var server = restify.createServer(opts);

    server.pre(function(request, response, next) {
        request.log.info(request.method, request.url);
        next();
    });

    server.use(restify.bodyParser({
        mapParams: false
    }));

    server.get('/', controllers.index);
    server.get(/^\/serve\/(.+?)$/, controllers.serve);
    server.get(/^\/resources\/(.+?)$/, controllers.getResource);
    server.put(/^\/resources\/(.+?)$/, controllers.updateResource);
    server.get(/^\/resources\/$/, controllers.allResources);

    server.get(/^\/safe\/resource\/(.+?)$/, controllers.safeViewResource);
    
    return server;
}

module.exports = {
    create: createServer
};

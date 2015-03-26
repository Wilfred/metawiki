"use strict"; 

var restify = require('restify');
var _ = require('underscore');

var log = require('./log');
var views = require('./views');

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

    server.get('/', views.index);
    server.get(/^\/serve\/(.+?)$/, views.serve);
    server.get(/^\/resources\/(.+?)$/, views.getResource);
    server.put(/^\/resources\/(.+?)$/, views.updateResource);
    server.get(/^\/resources\/$/, views.allResources);

    server.get(/^\/safe\/resource\/(.+?)$/, views.safeViewResource);
    
    return server;
}

module.exports = {
    create: createServer
};

"use strict";

var restify = require('restify');
var _ = require('underscore');

var log = require('./log');
var controllers = require('./controllers');
var resourceControllers = require('./resource-controllers');
var formatControllers = require('./format-controllers');

function createServer(opts) {
    opts = opts || {};

    var defaultOpts = {
        name: 'metawiki',
        log: log
    };

    opts = _.extend(defaultOpts, opts);
    var server = restify.createServer(opts);

    server.pre(function(request, response, next) {
        request.log.info(request.method, request.url.substring(0, 70));
        next();
    });

    server.use(restify.bodyParser({
        mapParams: false
    }));
    server.use(restify.queryParser());

    server.get('/', controllers.index);
    server.get(/^\/serve\/(.+?)$/, controllers.serve);

    // TODO: can we treat /resources/ as /resources ?
    server.get('/resources', resourceControllers.all);

    server.get('/resources/:path', resourceControllers.get);
    server.post('/resources/:path', resourceControllers.create);
    server.put('/resources/:path', resourceControllers.update);

    server.get(/^\/safe$/, controllers.safeViewAllResources);
    server.get(/^\/safe\/resource\/(.+?)$/, controllers.safeViewResource);

    server.get('/format', formatControllers.format);
    return server;
}

module.exports = {
    create: createServer
};

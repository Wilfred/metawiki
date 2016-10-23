"use strict";

var restify = require('restify');
var _ = require('underscore');

var models = require('./models');


function get(req, res, next) {
    var path = req.params.path;

    models.Resource.findOne({
        path: path
    }, function(err, resource) {
        if (resource === null) {
            next(new restify.NotFoundError(
                "No resource with path '" + path + "'"));
        } else {
            res.send(resource);
            next();
        }
    });
}

function update(req, res, next) {
    var path = req.params.path;

    if (!_.isString(req.body.content) || !_.isString(req.body.mimeType)) {
        next(new restify.BadRequestError(
            "You need to provide a body and a mimeType."));
        next();
        return;
    }

    models.Resource.findOneAndUpdate({
        path: path
    }, {
        content: req.body.content,
        mimeType: req.body.mimeType
    }, function(err, resource) {
        if (resource === null) {
            next(new restify.NotFoundError(
                "No resource with path '" + path + "'"));
        } else {
            res.send(resource);
            next();
        }
    });
}

function create(req, res, next) {
    var path = req.params.path;

    models.Resource.findOne({
        path: path
    }, function(err, existingResource) {
        if (existingResource === null) {
            var resource = new models.Resource({
                path: path,
                content: req.body.content
            });
            resource.save(function() {
                // TODO: should we send something else?
                res.send(resource);
                next();
            });
        } else {
            next(new restify.BadRequestError(
                "Resource with path '" + path + "' already exists."));
            next();
        }
    });
}

function all(req, res, next) {
    models.Resource.find({}, function(err, resources) {
        res.send(resources);
        next();
    });
}

module.exports = {
    get: get,
    create: create,
    update: update,
    all: all
};

"use strict";

var restify = require('restify');
var path = require('path');
var fs = require('fs');

var models = require('./models');

function serve(request, response, next) {
  var urlPath = request.params[0];

  models.Resource.findOne({
    path: urlPath
  }, function(err, resource) {
    if (resource === null) {
            // TODO: should be JSON with an error reason.
      next(new restify.NotFoundError(
                "No resource with path '" + urlPath + "'"));
    } else {
      response.writeHead(200, {
        'Content-Type': resource.mimeType + "; charset=UTF-8"
      });

      if (resource.content) {
        response.write(resource.content);
        response.end();
      } else if (resource.localPath) {
                // TODO: store both text and binary in mongo
        var appDir = path.dirname(require.main.filename);
        var absPath = path.join(appDir, "..", "..", "binary_files",
                                resource.localPath);

                // TODO: unit test to verify we don't allow directory
                // travel if localPath contains '..'.
        fs.readFile(absPath, function(err, data) {
          if (err) throw err; // TODO: HTTP 500/404 as appropriate

          response.write(data);
          response.end();
        });
      }
      next();
    }
  });
}

module.exports = {
  serve: serve
};

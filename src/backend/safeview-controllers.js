"use strict";

var path = require("path");
var fs = require("fs");
var Handlebars = require("handlebars");

var models = require("./models");

// Serve the index, but fail gracefully if the database is
// empty/missing.
function index(req, response, next) {
  response.setHeader("Content-Type", "text/html");

  var path = "metawiki/index.html";
  models.Resource.findOne(
    {
      path: path
    },
    function(err, indexResource) {
      if (indexResource === null) {
        fetchTemplate("index_missing.html", function(err, template) {
          if (err) {
            // TODO: proper logging.
            console.log(err);
            throw err;
          }

          response.writeHead(404);

          response.end(
            template({
              path: path
            })
          );
        });
      } else {
        response.writeHead(200);
        response.end(indexResource.content);
      }

      next();
    }
  );
}

function fetchTemplate(name, cb) {
  fs.readFile(
    path.join(__dirname, "templates", name),
    {
      encoding: "utf8"
    },
    function(err, templateSrc) {
      if (err) {
        cb(err, null);
        return;
      }

      var template;
      try {
        template = Handlebars.compile(templateSrc);
      } catch (e) {
        cb(err, null);
      }

      cb(null, template);
    }
  );
}

function safeViewAllResources(request, response, next) {
  response.setHeader("Content-Type", "text/html");

  models.Resource.find({})
    .sort("path")
    .exec(function(err, resources) {
      fetchTemplate("safe_view_all.html", function(err, template) {
        if (err) {
          // TODO: proper logging.
          console.log(err);
          throw err;
        }

        response.end(
          template({
            resources: resources
          })
        );
        next();
      });
    });
}

function safeViewResource(request, response, next) {
  var resourcePath = request.params[0];

  response.setHeader("Content-Type", "text/html");

  models.Resource.findOne(
    {
      path: resourcePath
    },
    function(err, resource) {
      fetchTemplate("safe_view.html", function(err, template) {
        if (err) {
          // TODO: proper logging.
          console.log(err);
          throw err;
        }

        response.writeHead(resource ? 200 : 404);
        response.end(
          template({
            resourceStr: JSON.stringify(resource, null, 4),
            resource: resource,
            resourcePath: resourcePath
          })
        );
        next();
      });
    }
  );
}

module.exports = {
  index: index,
  safeViewAllResources: safeViewAllResources,
  safeViewResource: safeViewResource
};

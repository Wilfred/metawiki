var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");
var async = require("async");
var db = require("./db.js");
var models = require("./models.js");

var resourceCount = 0;

async.series(
  [
    db.connect,

    function(cb) {
      models.Resource.find({}, function(err, resources) {
        resourceCount = resources.length;

        async.map(
          resources,
          function(resource, _cb) {
            var localPath;
            if (resource.bootstrapPath) {
              localPath = resource.bootstrapPath;
            } else {
              localPath = "src/frontend/" + path.basename(resource.path);
            }

            async.series(
              [
                function(__cb) {
                  mkdirp(path.dirname(localPath), {}, __cb);
                },
                function(__cb) {
                  fs.writeFile(localPath, resource.content, __cb);
                }
              ],
              _cb
            );
          },
          cb
        );
      });
    },

    db.disconnect
  ],
  function(err) {
    if (err) {
      console.log(["Failed:", err]);
    } else {
      console.log("Wrote %s resources to disk.", resourceCount);
    }
  }
);

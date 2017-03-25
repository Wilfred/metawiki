// jshint unused:true, undef:true
/* globals define, window */
define(function(require) {
  "use strict";

  var Backbone = require("backbone");
  var $ = require("jquery");

  var Resource = require("metawiki/models").Resource;
  var editor = require("metawiki/editor");

  var routing = null;
    /** Navigate to path. Routing depends on controllers, so we
    * have to require() here to avoid a cyclic dependency.
    */
  function navigate(path) {
    if (routing === null) {
      routing = require("metawiki/routing");
    }
    routing.navigate(path, {trigger: true});
  }

  var NewResource = Backbone.View.extend({
    el: $("#content"),

    render: function() {
      // FIXME: we should use either 'name' or 'path' consistently
      var hashPath = window.location.hash.substring(1);
      var resourceName = hashPath.split("?")[1];

      // FIXME: duplication between path and ID is silly.
      var resource = new Resource({
        path: resourceName});

      var editorInstance = editor.load("New", resource);

      $("input[type=submit]").click(function() {
        var $input = $(this);
        var resourceName = $("input[name=path]").val();

        var content = editorInstance.getValue();
        var mimeType = $("[name=mimeType]").val();

        var resource = new Resource({
          path: resourceName,
          content: content,
          mimeType: mimeType
        });
        resource.save();

        // don't go anywhere if we said 'save and continue'
        if ($input.attr("name") != "save-continue") {
          if (mimeType == "text/x-markdown") {
            navigate(resourceName);
          } else {
            navigate("page/Home");
          }
        }

        return false;
      });
    }
  });

  return {
    NewResource: NewResource
  };
});

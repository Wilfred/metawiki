// jshint unused:true, undef:true
/* globals define, window */
define(function(require) {
  "use strict";

  var Backbone = require("backbone");
  var $ = require("jquery");

  var Resource = require("metawiki/models").Resource;
  var messages = require('metawiki/messages');
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

  var EditView = Backbone.View.extend({
    el: $("#content"),

    render: function() {
      if (editor === undefined) {
        editor = require("metawiki/editor");
      }

      // Of the form 'edit?foo/bar'
      // TODO: this should be from the router directly
      var hashPath = window.location.hash.substring(1);
      var resourceName = hashPath.split("?")[1];

      var resource = new Resource({path: resourceName, id: resourceName});

      resource.fetch({
        success: function() {
          var editorInstance = editor.load("Editing", resource);

          // TODO: we should narrow this to children of the edit form.
          $("input[type=submit]").click(function() {
            var $input = $(this);
            var mimeType = $("[name=mimeType]").val();

            resource.save({
              content: editorInstance.getValue(),
              mimeType: mimeType
            }, {
              success: function() {
                messages.success('Saved', "Wrote " + resource.get('path') + " to database.");
                // don't go anywhere if we said 'save and continue'
                if ($input.attr("name") != "save-continue") {
                  // FIXME: what if we create a page called 'edit'?
                  if (mimeType == "text/x-markdown") {
                    navigate(resourceName);
                  } else {
                    navigate("page/Home");
                  }
                }
              }
            });

            return false;
          });

        }, error: function() {
          // Page doesn't exist
          navigate("new?" + resourceName);
        }
      });
    }
  });
  
  return EditView;
});

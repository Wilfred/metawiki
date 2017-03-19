define(function(require) {
  "use strict";

  var Backbone = require("backbone");
  var Handlebars = require("handlebars/handlebars");
  var $ = require("jquery");
  var marked = require("marked/marked");

  var templates = require("metawiki/templates");
  var Resource = require("metawiki/models").Resource;
  var messages = require('metawiki/messages');
  var editor = require("metawiki/editor");

  marked.setOptions({
    sanitize: true
  });

    // FIXME: this applies to all resources, not just pages.
  var AllPages = Backbone.View.extend({
        // todo: separate out a main view
    el: $("#content"),
    render: function() {
      var self = this;

            // todo: we should probably do this in initialize.
      var resources = new models.AllResources();
      resources.fetch({
        success: function() {
          var renderedContent = new Handlebars.SafeString(
                        templates.allResources(resources.toJSON())
                    );

          self.$el.html(templates.pageTemplate({
            content: renderedContent
          }));
        }
      });

      return self;
    }
  });

    // TODO: factor out a Nav view
  var ViewPage = Backbone.View.extend({
    el: $("#content"),

        // TODO: we should probably take the page name in
        // initialize instead.
    render: function(pageName) {
      var self = this;

      var path = "page/" + pageName;
      var page = new Resource({path: path, id: path});

      page.fetch({
        success: function() {
          var renderedContent = new Handlebars.SafeString(
                        marked(page.get("content")));

          self.$el.html(templates.pageTemplate({
            path: page.get("path"),
            content: renderedContent
          }));
        },
        error: function() {
          self.$el.html(templates.pageMissingTemplate({
            path: page.get("path")
          }));
        }
      });

      return self;
    }
  });

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

  var EditResource = Backbone.View.extend({
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
                messages.success('Saved', "Wrote " + this + " to database.");
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
    AllPages: AllPages,
    ViewPage: ViewPage,
    EditResource: EditResource,
    NewResource: NewResource
  };
});

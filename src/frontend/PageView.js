// jshint unused:true, undef:true
/* globals define */
define(function(require) {
  "use strict";

  var Backbone = require("backbone");
  var Handlebars = require("handlebars/handlebars");
  var $ = require("jquery");
  var marked = require("marked/marked");

  var templates = require("metawiki/templates");
  var Resource = require("metawiki/models").Resource;

  marked.setOptions({
    sanitize: true
  });

  // TODO: factor out a Nav view
  var PageView = Backbone.View.extend({
    el: $("#content"),

    // TODO: we should probably take the page name in
    // initialize instead.
    render: function(pageName) {
      var self = this;

      var path = "page/" + pageName;
      var page = new Resource({path: path, id: path});

      page.fetch({
        success: function() {
          var renderedContent = marked(page.get("content"));

          self.$el.html(templates.pageTemplate({
            path: page.get("path"),
            content: new Handlebars.SafeString(renderedContent)
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

  return PageView;
});

// jshint unused:true, undef:true
/* globals define */
define(function(require) {
  var Backbone = require("backbone");

  var PageView = require("metawiki/PageView");
  var EditView = require("metawiki/EditView");
  var AllPagesController = require("metawiki/AllPagesController");
  var controllers = require("metawiki/controllers");

  var Router = Backbone.Router.extend({
    initialize: function() {
      this.route("all", "allPages", function() {
        var allPages = new AllPagesController();
        allPages.render();
      });

      this.route("page/:pageName", "pageView", function(pageName) {
        var pageView = new PageView();
        pageView.render(pageName);
      });
      this.route("edit*", "editView", function() {
        (new EditView()).render();
      });
      this.route("new*", "newPage", function() {
        var newResource = new controllers.NewResource();
        newResource.render();
      });
    }
  });

  return new Router();
});

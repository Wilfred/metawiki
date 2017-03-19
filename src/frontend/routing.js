define(function(require) {
  var Backbone = require("backbone");

  var AllPagesController = require("metawiki/AllPagesController");
  var controllers = require("metawiki/controllers");

  var Router = Backbone.Router.extend({
    initialize: function(_options) {
      this.route("all", "allPages", function() {
        var allPages = new AllPagesController();
        allPages.render();
      });

      this.route("page/:pageName", "viewPage", function(pageName) {
        var viewPage = new controllers.ViewPage();
        viewPage.render(pageName);
      });
      this.route("edit*", "editResource", function() {
        var editResource = new controllers.EditResource();
        editResource.render();
      });
      this.route("new*", "newPage", function() {
        var newResource = new controllers.NewResource();
        newResource.render();
      });
    }
  });

  var router = new Router();

  return router;
});

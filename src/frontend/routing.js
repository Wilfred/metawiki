define([
    'backbone',
    'metawiki/controllers',
], function(Backbone, controllers) {
    var Router = Backbone.Router.extend({
        initialize: function(options) {
            this.route('all', 'allPages', function() {
                var allPages = new controllers.AllPages;
                allPages.render();
            });
            
            this.route('page/:pageName', 'viewPage', function(pageName) {
                var viewPage = new controllers.ViewPage;
                viewPage.render(pageName);
            });
            this.route('edit*', 'editResource', function() {
                var editResource = new controllers.EditResource;
                editResource.render();
            });
            this.route('new*', 'newPage', controllers.newPage);
        }
    });
    
    var router = new Router;
    
    return router;
});

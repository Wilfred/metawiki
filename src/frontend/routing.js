define([
    'backbone',
    'metawiki/controllers',
], function(Backbone, controllers) {
    var Router = Backbone.Router.extend({
        initialize: function(options) {
            this.route('all', 'allPages', controllers.allPages);
            
            this.route('md/:pageName', 'viewPage', controllers.viewPage);
            this.route('edit*', 'editPage', controllers.editPage);
            this.route('new*', 'newPage', controllers.newPage);
        }
    });
    
    var router = new Router;
    
    return router;
});

define(['backbone', 'jquery'], function(Backbone) {
    var Resource = Backbone.Model.extend({
        urlRoot: '/resources/'
    });
    
    return {
        Resource: Resource
    };
});

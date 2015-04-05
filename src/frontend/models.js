define(['backbone'], function(Backbone) {
    var Resource = Backbone.Model.extend({
        urlRoot: '/resources/'
    });
    
    return {
        Resource: Resource
    };
});

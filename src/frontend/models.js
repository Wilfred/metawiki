define(['backbone'], function(Backbone) {
    var Resource = Backbone.Model.extend({
        url: function() {
            // TODO: Is this a sign that our backend should be changed
            // to accept the default backbone URL patterns?
            var base = this.urlRoot;
            return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.get('path'));
        },
        urlRoot: '/resources/'
    });
    
    var AllResources = Backbone.Collection.extend({
        model: Resource,
        url: '/resources'
    });
    
    return {
        AllResources: AllResources,
        Resource: Resource
    };
});

define(['jquery/jquery'], function() {
    var Resource = {
        fetch: function fetch(resourceName, callback) {
            $.ajax({url:"/resources/" + resourceName}).done(function(resource) {
                // TODO: Handle 404 and 500.
                callback(null, resource);
                
            });
        }, save: function save(name, content, callback) {
            $.ajax({
                url:"/resources/" + name,
                data: {name: name, content: content},
                type: 'PUT'
            }).done(function(resource) {
                // TODO: Handle 404 and 500.
                callback(null, resource);
            });
        }, create: function create(name, content, callback) {
            $.ajax({
                url:"/resources/" + name,
                data: {name: name, content: content},
                type: 'POST'
            }).done(function(resource) {
                // TODO: Handle 404 and 500.
                callback(null, resource);
            });
        }
    };
    
    return {Resource: Resource};
});

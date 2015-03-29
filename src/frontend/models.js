define(['jquery/jquery'], function() {
    var Resource = {
        fetch: function fetch(resourceName, callback) {
            $.ajax({url:"/resources/" + resourceName}).done(function(resource) {
                // TODO: Handle 404 and 500.
                callback(null, resource);
                
            });
        }, save: function save(name, content, mimeType, callback) {
            $.ajax({
                url:"/resources/" + name,
                data: {
                    name: name,
                    content: content,
                    mimeType: mimeType
                },
                type: 'PUT'
            }).done(function(resource) {
                // TODO: Handle 404 and 500.
                callback(null, resource);
            });
        }, create: function create(name, content, mimeType, callback) {
            $.ajax({
                url:"/resources/" + name,
                data: {
                    name: name,
                    content: content,
                    mimeType: mimeType
                },
                type: 'POST'
            }).done(function(resource) {
                // TODO: Handle 404 and 500.
                callback(null, resource);
            });
        }
    };
    
    return {Resource: Resource};
});

// The clientside wiki app.

// Models.
var Resource = {
    fetch: function fetch(resourceName, callback) {
        $.ajax({url:"/resources/" + resourceName}).done(function(resource) {
            // TODO: Handle 404 and 500.
            callback(null, resource);
        });
    }
}

// Templating.
var $content = $("#content"),
    editorTemplate = Handlebars.compile($("#editor-template").html());

// Controllers.
routie('md/:pageName', function(pageName) {
    Resource.fetch("md/" + pageName, function(err, page) {
        $content.html(marked(page.content));
    });
});

routie('edit/*', function() {
    var resourceName = window.location.hash.substr("#edit/".length);

    Resource.fetch(resourceName, function(err, page) {
        $content.html(editorTemplate({
            content: page.content,
            resourceName: resourceName
        }));

        CodeMirror.fromTextArea($('#editor').get(0), {
            lineNumbers: true
        });
    });
});

// Initialisation.
routie('md/Home');

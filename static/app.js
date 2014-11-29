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

routie('edit*', function() {
    // Of the form 'edit?foo/bar'
    var hashPath = window.location.hash.substring(1);
    var resourceName = hashPath.split('?')[1];

    Resource.fetch(resourceName, function(err, resource) {
        loadEditor("Editing " + resource.name, resource);
    });
});

routie('new*', function() {
    loadEditor("New", null);
});

// Views.
function loadEditor(heading, resource) {
    $content.html(editorTemplate({
        content: resource ? resource.content : "",
        heading: heading
    }));

    CodeMirror.fromTextArea($('#editor').get(0), {
        lineNumbers: true
    });
}

// Initialisation.
routie('md/Home');

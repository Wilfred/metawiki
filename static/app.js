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
Handlebars.registerHelper('ifEqual', function(v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

var $content = $("#content"),
    editorTemplate = Handlebars.compile($("#editor-template").html());

// Controllers.
routie('md/:pageName', function viewController(pageName) {
    console.log('controller called!')
    Resource.fetch("md/" + pageName, function(err, page) {
        $content.html(marked(page.content));
    });
});

routie('edit*', function editController() {
    // Of the form 'edit?foo/bar'
    var hashPath = window.location.hash.substring(1);
    var resourceName = hashPath.split('?')[1];

    Resource.fetch(resourceName, function(err, resource) {
        loadEditor("Editing", resource);
    });
});

routie('new*', function newController() {
    loadEditor("New", null);
});

// Views.
function loadEditor(heading, resource) {
    $content.html(editorTemplate({
        content: resource ? resource.content : "",
        mimeType: resource ? resource.mimeType : "text/x-markdown",
        path: resource ? resource.path : "",
        heading: heading
    }));

    var cm = CodeMirror.fromTextArea($('#editor').get(0), {
        lineNumbers: true
    });

    $('.eval-contents').click(function() {
        /* jshint evil: true */
        eval(cm.getValue());
        /* jshint evil: false */
    })
}

// Initialisation.
routie('md/Home');

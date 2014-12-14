/*global Handlebars, routie */

// The clientside wiki app.

// Models.
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
            type: 'PUT',
        }).done(function(resource) {
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

function getHash() {
    return window.location.hash.substring(1);
}

// Controllers.
routie('md/:pageName', function viewController(pageName) {
    Resource.fetch("md/" + pageName, function(err, page) {
        $content.html(marked(page.content));
    });
});

routie('edit*', function editController() {
    // Of the form 'edit?foo/bar'
    var hashPath = window.location.hash.substring(1);
    var resourceName = hashPath.split('?')[1];

    Resource.fetch(resourceName, function(err, resource) {
        var editor = loadEditor("Editing", resource);

        // TODO: we should narrow this to children of the edit form.
        // TODO: create too.
        $('input[type=submit]').click(function() {
            Resource.save(resourceName, editor.getValue(), function() {
              // TODO: go to a more sensible location
              routie('md/Home');
            })
            return false;
        })
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
    });

    return cm;
}

// Initialisation.
if (getHash() === "") {
    routie('md/Home');
}

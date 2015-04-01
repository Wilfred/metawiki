// The clientside wiki app.
define([
    'wikicircle/models',
    'wikicircle/templates',
    'handlebars/handlebars',
    'marked/marked',
    'codemirror/lib/codemirror',
    'codemirror/addon/edit/matchbrackets',
    "codemirror/mode/javascript/javascript",
    "codemirror/mode/markdown/markdown",
    "codemirror/mode/css/css",
    "codemirror/mode/xml/xml",
    'jquery/jquery'
], function(models, templates, Handlebars, marked, CodeMirror) {
    var Resource = models.Resource;
    
    // Views.
    function loadEditor(heading, resource) {
        resource = resource || {};
        var mimeType = resource.mimeType || "text/x-markdown";
        var mode = "javascript";
        
        if (mimeType == "text/x-markdown") {
            mode = "markdown";
        } else if (mimeType == "text/html") {
            mode = "xml";
        } else if (mimeType == "text/css") {
            mode = "css";
        }
        
        templates.$content.html(
            templates.pageTemplate({
                content: new Handlebars.SafeString(templates.editorTemplate({
                    content: resource.content || "",
                    mimeType: mimeType,
                    path: resource.path || "",
                    heading: heading
                }))
        }));
        
        var cm = CodeMirror.fromTextArea($('#editor').get(0), {
            lineNumbers: true,
            indentUnit: 4,
            matchBrackets: true,
            mode: mode
        });
        
        cm.setOption("extraKeys", {
            Tab: "indentAuto"
        });
        
        $('input[name=execute]').click(function(e) {
            eval(cm.getValue());
            e.preventDefault();
            return false;
        });
        
        return cm;
    }
    
    // Controllers
    function viewController(pageName) {
        var path = "md/" + pageName;
        Resource.fetch(path, function(err, page) {
            if (err) {
                templates.$content.html(templates.pageMissingTemplate({
                    path: path
                }));
                return;
            }
            templates.$content.html(templates.pageTemplate({
                path: path,
                content: new Handlebars.SafeString(marked(page.content))
            }));
        });
    }
    
    function editController() {    
        // Of the form 'edit?foo/bar'
        var hashPath = window.location.hash.substring(1);
        var resourceName = hashPath.split('?')[1];
        
        Resource.fetch(resourceName, function(err, resource) {
            var editor = loadEditor("Editing", resource);
            
            // TODO: we should narrow this to children of the edit form.
            // TODO: create too.
            $('input[type=submit]').click(function() {
                var $input = $(this);
                
                var content = editor.getValue();
                var mimeType = $('[name=mimeType]').val();

                Resource.save(resourceName, content, mimeType, function() {
                    // don't go anywhere if we said 'save and continue'
                    if ($input.attr('name') != 'save-continue') {
                        // FIXME: what if we create a page called 'edit'?
                        if (mimeType == "text/x-markdown") {
                            routie(resourceName);
                        } else {
                            routie("md/Home");
                        }
                    }
                });
                return false;
            });
        }); 
    }
    
    function newController() {
        var hashPath = window.location.hash.substring(1);
        var resourceName = hashPath.split('?')[1];
        
        // FIXME: we should use either 'name' or 'path' consistently
        var editor = loadEditor("New", {path: resourceName});
        
        $('input[type=submit]').click(function() {
            var $input = $(this);
            var resourceName = $('input[name=path]').val();
            
            var content = editor.getValue();
            var mimeType = $('[name=mimeType]').val();
            
            Resource.create(resourceName, content, mimeType, function() {
                // don't go anywhere if we said 'save and continue'
                if ($input.attr('name') != 'save-continue') {
                    if (mimeType == "text/x-markdown") {
                        routie(resourceName);
                    } else {
                        routie("md/Home");
                    }
                }
            });
            return false;
        });
    }
    
    // TODO: these names are a little redundant with the module name
    return {
        viewController: viewController,
        editController: editController,
        newController: newController
    };
});

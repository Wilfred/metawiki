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
    'jquery'
], function(models, templates, Handlebars, marked, CodeMirror) {
    "use strict";
    
    var Resource = models.Resource;
    
    function loadEditor(heading, resource) {
        resource = resource || new Resource();
        var mimeType = resource.get('mimeType') || "text/x-markdown";
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
                    content: resource.get('content') || "",
                    mimeType: mimeType,
                    path: resource.get('path') || "",
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
    
    function viewPage(pageName) {
        var page = new Resource({id: 'md/' + pageName});
        
        page.fetch({
            success: function() {
                var renderedContent = new Handlebars.SafeString(
                    marked(page.get('content')));
                
                templates.$content.html(templates.pageTemplate({
                    path: page.get('path'),
                    content: renderedContent
                }));
            },
            error: function() {
                templates.$content.html(templates.pageMissingTemplate({
                    path: page.get('id')
                }));            
            }
        });
    }
    
    function editPage() {    
        // Of the form 'edit?foo/bar'
        // TODO: factor out
        var hashPath = window.location.hash.substring(1);
        var resourceName = hashPath.split('?')[1];
        
        var resource = new Resource({id: resourceName});
 
        resource.fetch({
            success: function() {
                var editor = loadEditor("Editing", resource);
            
                // TODO: we should narrow this to children of the edit form.
                $('input[type=submit]').click(function() {
                    var $input = $(this);
                    var mimeType = $('[name=mimeType]').val()
                    
                    resource.save({
                        content: editor.getValue(),
                        mimeType: mimeType
                    },{
                        success: function() {
                            // don't go anywhere if we said 'save and continue'
                            if ($input.attr('name') != 'save-continue') {
                                // FIXME: what if we create a page called 'edit'?
                                if (mimeType == "text/x-markdown") {
                                    routie(resourceName);
                                } else {
                                    routie("md/Home");
                                }
                            }
                        }
                    });
                    
                    return false;
                    
                });
                 
            }, error: function() {
                // Page doesn't exist
                // FIXME: need to set URL too.
                return newPage();       
            }
        });
    }
    
    function newPage() {
        var hashPath = window.location.hash.substring(1);
        var resourceName = hashPath.split('?')[1];
        // FIXME: duplication between path and ID is silly.
        var resource = new Resource({
            id: resourceName, 
            path: resourceName});
        
        // FIXME: we should use either 'name' or 'path' consistently
        var editor = loadEditor("New", resource);
        
        $('input[type=submit]').click(function() {
            var $input = $(this);
            var resourceName = $('input[name=path]').val();
            
            var content = editor.getValue();
            var mimeType = $('[name=mimeType]').val();
            
            var resource = new Resource({
                id: resourceName,
                content: content,
                mimeType: mimeType
            });
            resource.save();
            
            // don't go anywhere if we said 'save and continue'
            if ($input.attr('name') != 'save-continue') {
                if (mimeType == "text/x-markdown") {
                    routie(resourceName);
                } else {
                    routie("md/Home");
                }
            }

            return false;
        });
    }
    
    return {
        viewPage: viewPage,
        editPage: editPage,
        newPage: newPage
    };
});

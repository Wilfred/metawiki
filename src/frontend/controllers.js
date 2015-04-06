define([
    'require',
    'metawiki/models',
    'metawiki/templates',
    'metawiki/editor',
    'handlebars/handlebars',
    'marked/marked',
    'jquery'
], function(require, models, templates, editor, Handlebars, marked) {
    "use strict";
    
    var Resource = models.Resource;
    
    marked.setOptions({
        sanitize: true
    });
    
    function allPages() {
        var resources = new models.AllResources;
        resources.fetch({
            success: function() {
                var renderedContent = new Handlebars.SafeString(
                    templates.allResources(resources.toJSON())
                );
        
                templates.$content.html(templates.pageTemplate({
                    content: renderedContent
                }));
            }
        });
    }
    
    function viewPage(pageName) {
        var path = 'page/' + pageName;
        var page = new Resource({path: path, id: path});
        
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
                    path: page.get('path')
                }));            
            }
        });
    }
    
    var routing = null;
    /** Navigate to path. Routing depends on controllers, so we
    * have to require() here to avoid a cyclic dependency.
    */
    function navigate(path) {
        if (routing === null) {
            routing = require('metawiki/routing');
        }
        routing.navigate(path, {trigger: true});
    }
    
    function editPage() {
        // 'editor' is undefined due to our cyclic dependency.
        if (editor === undefined) {
            editor = require('metawiki/editor');
        }
        
        // Of the form 'edit?foo/bar'
        // TODO: this should be from the router directly
        var hashPath = window.location.hash.substring(1);
        var resourceName = hashPath.split('?')[1];
        
        var resource = new Resource({path: resourceName, id: resourceName});
 
        resource.fetch({
            success: function() {
                var editorInstance = editor.load("Editing", resource);
            
                // TODO: we should narrow this to children of the edit form.
                $('input[type=submit]').click(function() {
                    var $input = $(this);
                    var mimeType = $('[name=mimeType]').val()
                    
                    resource.save({
                        content: editorInstance.getValue(),
                        mimeType: mimeType
                    },{
                        success: function() {
                            // don't go anywhere if we said 'save and continue'
                            if ($input.attr('name') != 'save-continue') {
                                // FIXME: what if we create a page called 'edit'?
                                if (mimeType == "text/x-markdown") {
                                    navigate(resourceName);
                                } else {
                                    navigate("page/Home");
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
            path: resourceName});
        
        // FIXME: we should use either 'name' or 'path' consistently
        var editorInstance = editor.load("New", resource);
        
        $('input[type=submit]').click(function() {
            var $input = $(this);
            var resourceName = $('input[name=path]').val();
            
            var content = editorInstance.getValue();
            var mimeType = $('[name=mimeType]').val();
            
            var resource = new Resource({
                path: resourceName,
                content: content,
                mimeType: mimeType
            });
            resource.save();
            
            // don't go anywhere if we said 'save and continue'
            if ($input.attr('name') != 'save-continue') {
                if (mimeType == "text/x-markdown") {
                    navigate(resourceName);
                } else {
                    navigate("page/Home");
                }
            }

            return false;
        });
    }
    
    return {
        allPages: allPages,
        viewPage: viewPage,
        editPage: editPage,
        newPage: newPage
    };
});

define(function(require) {
    var Handlebars = require("handlebars/handlebars");
    var $ = require("jquery");

    Handlebars.registerHelper("ifEqual", function(v1, v2, options) {
        if (v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    var $content = $("#content");

    var editorTemplateSrc = $("#editor-template").html();
    var editorTemplate = Handlebars.compile(editorTemplateSrc);

    var pageTemplateSrc = $("#page-template").html();
    var pageTemplate = Handlebars.compile(pageTemplateSrc);

    var pageMissingTemplateSrc = $("#page-missing-template").html();
    var pageMissingTemplate = Handlebars.compile(pageMissingTemplateSrc);

    var allResourcesSrc = $("#all-resources-template").html();
    var allResources = Handlebars.compile(allResourcesSrc);

    return {
        $content: $content,
        editorTemplate: editorTemplate,
        pageTemplate: pageTemplate,
        pageMissingTemplate: pageMissingTemplate,
        allResources: allResources
    };
});

define(function(require) {
    "use strict";

    var Backbone = require("backbone");
    var Handlebars = require("handlebars/handlebars");
    var $ = require("jquery");

    var templates = require("metawiki/templates");
    var models = require("metawiki/models");

    // FIXME: this applies to all resources, not just pages.
    var AllPages = Backbone.View.extend({
        // todo: separate out a main view
        el: $("#content"),
        render: function() {
            var self = this;

            // todo: we should probably do this in initialize.
            var resources = new models.AllResources();
            resources.fetch({
                success: function() {
                    var renderedContent = new Handlebars.SafeString(
                        templates.allResources(resources.toJSON())
                    );

                    self.$el.html(templates.pageTemplate({
                        content: renderedContent
                    }));
                }
            });

            return self;
        }
    });

    return AllPages;
});

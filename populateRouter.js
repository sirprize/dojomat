/*jslint browser: true */
/*global define: true */

define([
    "routed/Route",
    "dojo/_base/lang"
], function (
    Route,
    lang
) {
    "use strict";
    
    return function (application, map) {
        var name = null,
            makeCallback = function (widgetClass, loader) {
                return function (request) {
                    application.makePage(request, widgetClass, loader);
                };
            };

        for (name in map) {
            if (map.hasOwnProperty(name)) {
                application.router.addRoute(name, new Route(map[name].schema, lang.hitch(application, makeCallback(map[name].widget, map[name].loader))));
            }
        }
    };
});
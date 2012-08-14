/*jslint browser: true */
/*global define: true */

define([
    "routed/Request",
    "routed/Router",
    "routed/Route",
    "dijit/registry",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/json",
    "dojo/ready",
    "dojo/has",
    "dojo/on",
    "dojo/query",
    "dojo/topic",
    "dojo/dom-construct",
    "./Notification",
    "dojo/domReady!"
], function (
    Request,
    Router,
    Route,
    registry,
    declare,
    lang,
    json,
    ready,
    has,
    on,
    query,
    topic,
    domConstruct,
    Notification
) {
    "use strict";

    // http://underscorejs.org - _.debounce(function, wait, [immediate])
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    var debounce = function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments,
                later = function () {
                    timeout = null;
                    if (!immediate) {
                        func.apply(context, args);
                    }
                },
                callNow = immediate && !timeout;

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, args);
            }
        };
    };

    return declare([], {

        router: new Router(),
        notification: new Notification(),
        styleElement: null,

        init: function (map) {
            ready(lang.hitch(this, function () {
                this.setRoutes(map);
                this.setSubscriptions();
                this.handlePopState();
                this.setHasHistory();
                this.setHasLocalStorage();
                this.handleState();
            }));
        },

        setCss: function (css) {
            if (!this.styleElement) {
                this.styleElement = window.document.createElement('style');
                this.styleElement.setAttribute("type", "text/css");
                query('head')[0].appendChild(this.styleElement);
            }

            if (this.styleElement.styleSheet) {
                this.styleElement.styleSheet.cssText = css; // IE
            } else {
                this.styleElement.innerHTML = '';
                this.styleElement.appendChild(window.document.createTextNode(css)); // the others
            }
        },

        setPageNode: function () {
            if (registry.byId('page')) {
                registry.byId('page').destroyRecursive();
            }
            
            domConstruct.create('div', { id: 'page' }, query('body')[0], 'first');
        },

        handleState: debounce(function () {
            var route = null, request = new Request(window.location.href);

            this.router.route(request);
            route = this.router.getCurrentRoute();

            if (route) {
                route.run(request);
            } else {
                this.makeErrorPage({ message: 'No route found for ' + window.location.href });
            }
        }, 500, true),

        handlePopState: function () {
            on(window, 'popstate', lang.hitch(this, function (ev) {
                this.handleState();
            }));
        },

        makeNotFoundPage: function () {
            // stub
        },

        makeErrorPage: function (error) {
            // stub
        },

        makePage: function (request, widget) {
            require([widget], lang.hitch(this, function (Page) {
                this.setPageNode();

                var page = new Page({
                    request: request,
                    router: this.router,
                    notification: this.notification.get()
                }, 'page');
                
                this.notification.clear();
                page.startup();
            }));
        },

        setSubscriptions: function () {
            topic.subscribe('dojod/_Page/css', lang.hitch(this, function (args) {
                this.setCss(args.css);
            }));

            topic.subscribe('dojod/_Page/title', lang.hitch(this, function (args) {
                window.document.title = args.title;
            }));

            topic.subscribe('dojod/_Page/notification', lang.hitch(this, function (notification) {
                this.notification.set(notification);
            }));

            topic.subscribe('dojod/_Page/error', lang.hitch(this, function (error) {
                this.makeErrorPage(error);
            }));

            topic.subscribe('dojod/_Page/not-found', lang.hitch(this, function () {
                this.makeNotFoundPage();
            }));

            topic.subscribe('dojod/_Widget/push-state', lang.hitch(this, function (args) {
                history.pushState(args.state, args.title, args.url);
                this.handleState();
            }));
        },

        setRoutes: function (map) {
            var that = this,
                name = null,
                makeCallback = function (widgetClass) {
                    return function (request) {
                        that.makePage(request, widgetClass);
                    };
                };

            for (name in map) {
                if (map.hasOwnProperty(name)) {
                    that.router.addRoute(name, new Route(map[name].schema, makeCallback(map[name].widget)));
                }
            }
        },

        setHasHistory: function () {
            // Thanks has.js
            has.add('native-history-state', function (g) {
                return g.history !== undefined && g.history.pushState !== undefined;
            });
        },

        setHasLocalStorage: function () {
            // Thanks has.js
            has.add('native-localstorage', function (g) {
                var supported = false;
                try {
                    supported = g.localStorage !== undefined && g.localStorage.setItem !== undefined;
                } catch (e) {}
                return supported;
            });
        }
    });
});
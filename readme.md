# Dispatched

Core components for single page apps based on the dojo widget architecture and history API

## Introduction

Dispatched is a set of mixins providing a framework for single page apps based on the [History API](https://developer.mozilla.org/en/DOM/Manipulating_the_browser_history/) on top of the [Dojo widget](http://dojotoolkit.org/documentation/tutorials/1.7/templated/) architecture. Request routing is handled by [Routed](https://github.com/sirprize/routed). Currently there is no fallback behavior for hash-based routing but this probably wouldn't be too hard to implement - most likely, this functionality would go into _App.handleState() and _Widget.go()

## _App

The `_App` mixin is the entry point into your application. It dispatches the current state (`window.location.href`) to route-functions which are respnsible for page instantiations. `_App` is built to work with a set of top-level page widgets and handles the placement of those page widgets into the DOM. It also provides functionality for adding stylesheets. Here's how to build your own custom app:

    define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dispatched/_App"
        "dojo/domReady!"
    ], function(
        declare,
        lang,
        App
    ) {
        var map = {
            home: { schema: '/', widget: 'my/HomePage' },
            releases: { schema: '/releases/', widget: 'my/ReleaseIndexPage' },
            release: { schema: '/release/:id', widget: 'my/ReleaseDetailPage' }
        };
        
        return declare([App], {

            constructor: function() {
                this.init(map);
            },

            makeNotFoundPage: function() {
                var makePage = function(Page) {
                    this.setPageNode();

                    var page = new Page({
                        router: this.router,
                        error: {}
                    }, 'page');
                    
                    page.startup();
                }

                require(['my/ErrorPage'], lang.hitch(this, makePage));
            },

            makeErrorPage: function(message) {
                var makePage = function(Page) {
                    this.setPageNode();

                    var page = new Page({
                        router: this.router,
                        message: message
                    }, 'page');
                    
                    page.startup();
                }

                require(['my/ErrorPage'], lang.hitch(this, makePage));
            }
        });
    });

## _Page

The `_Page` mixin has a small set of methods to manipulate top level elements such as the page title and stylesheets. Those methods simply publish topics to which `_App` is subscribed to.

## _Widget

Widgets are UI components placed in `_Page` widgets and simplify the task of pushing to a new state by means of `widget.go(url)`

## License

See LICENSE.
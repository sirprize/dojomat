# Dojod

Core components for single page apps based on the dojo widget architecture and history API

## Introduction

Dojod is a set of mixins providing a framework for single page apps based on the [History API](https://developer.mozilla.org/en/DOM/Manipulating_the_browser_history/) on top of the [Dojo widget](http://dojotoolkit.org/documentation/tutorials/1.7/templated/) architecture. Request routing is handled by [Spirr](https://github.com/sirprize/spirr). Currently there is no fallback behavior for hash-base routing but this probably wouldn't be too hard to implement - most likely, this functionality would go into _App.handleState() and _Partial.go()

## _App

The `_App` mixin is the entry point into your application. It dispatches the current state (`window.location.href`) to actions (pages). It is based on the idea of a top-level widget representing a page and handles the placement of those page widgets into the DOM. It also provides the functionality of adding stylesheets. Here's how to build your own custom app:

    define([
        "dojo/_base/declare",
        "dojo/ready",
        "sirprize/dojod/_App"
        "dojo/domReady!"
    ], function(
        declare,
        ready,
        App
    ) {
        var map = {
            home: { schema: '/', widget: 'my/HomePageWidget' },
            releases: { schema: '/releases/', widget: 'my/ReleasesPageWidget' },
            release: { schema: '/release/:id', widget: 'my/ReleasePageWidget' }
        };
        
        return declare([App], {

            constructor: function() {
                var that = this;

                ready(function() {
                    that.setRoutes(map);
                    that.setSubscriptions();
                    that.handlePopState();
                    that.setHasHistory();
                    that.handleState();
                });
            },

            makeErrorPage: function(message) {
                var that = this;

                require(['my/ErrorPageWidget'], function(Page) {
                    that.setPageNode();

                    var page = new Page({ router: that.router, message: message }, 'page');
                    page.startup();
                });
            }
        });
    });

## _Page

The `_Page` mixin has a simple set of methods to manipulate top level elements such as the page title and stylesheets. Those methods simply publish topics to which `_App` is subscribed to.

## _Partial

Partials are child widgets of `_Page` and simplify the task of pushing to a new state by means of `partial.go(url)`

## License

See LICENSE.
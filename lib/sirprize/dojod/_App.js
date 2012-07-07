define([
    "sirprize/spirr/Request",
    "sirprize/spirr/Router",
    "sirprize/spirr/Route",
    "dijit/registry",
    "dojo/_base/declare",
    "dojo/has",
    "dojo/on",
    "dojo/query",
    "dojo/topic",
    "dojo/dom-construct",
    "dojo/domReady!"
], function(
    Request,
    Router,
    Route,
    registry,
    declare,
    has,
    on,
    query,
    topic,
    domConstruct
) {
    // http://underscorejs.org - _.debounce(function, wait, [immediate])
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    var debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, args);
            }
        };
    };
    
    return declare([], {
        
        router: Router(),
        styleElement: null,
        
        setStyle: function(css) {
            if(!this.styleElement) {
                this.styleElement = document.createElement('style');
                this.styleElement.setAttribute("type", "text/css");
                query('head')[0].appendChild(this.styleElement);
            }
        
            if(this.styleElement.styleSheet) {
                this.styleElement.styleSheet.cssText = css; // IE
            } else {
                this.styleElement.innerHTML = '';
                this.styleElement.appendChild(document.createTextNode(css)); // the others
            }
        },
    
        setPageNode: function() {
            if(registry.byId('page')) {
                registry.byId('page').destroyRecursive();
            
                domConstruct.create("div", {
                    id: 'page'
                }, query('#page-box')[0]);
            }
        },

        handleState: debounce(function() {
            var route = null, request = Request(window.location.href);
        
            this.router.route(request);
            route = this.router.getCurrentRoute();

            if(route) {
                route.run(request);
            }
            else {
                this.makeErrorPage({ message: 'No route found for ' + window.location.href });
            }
        }, 500, true),
        
        handlePopState: function() {
            var that = this;
            
            on(window, 'popstate', function (ev) {
                that.handleState();
            });
        },
    
        makeErrorPage: function(error) {
            // stub
        },
        
        makePage: function(request, widget) {
            var that = this;
            
            require([widget], function(Page) {
                that.setPageNode();
                
                var page = new Page({ request: request, router: that.router }, 'page');
                page.startup();
            });
        },
        
        setSubscriptions: function() {
            var that = this;
            
            topic.subscribe('sirprize/dojod/_Page/css', function(args) {
                that.setStyle(args.css);
            });

            topic.subscribe('sirprize/dojod/_Page/title', function(args) {
                window.document.title = args.title;
            });

            topic.subscribe('sirprize/dojod/_Page/error', function(error) {
                that.makeErrorPage(error);
            });

            topic.subscribe('sirprize/dojod/_Page/not-found', function() {
                that.makeErrorPage({});
            });

            topic.subscribe('sirprize/dojod/_Partial/push-state', function(args) {
                history.pushState(args.state, args.title, args.url);
                that.handleState();
            });
        },
        
        setRoutes: function(map) {
            var that = this;
            
            for(var name in map) {
                var callback = function(widgetClass) {
                    return function(request) {
                        that.makePage(request, widgetClass);
                    }
                };

                that.router.addRoute(name, Route(map[name].schema, callback(map[name].widget)));
            }
        },
        
        setHasHistory: function() {
            has.add('native-history-state', function(g) {
                return ("history" in g) && ("pushState" in history);
            });
        }
    });
});
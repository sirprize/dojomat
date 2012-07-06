define([
    "dojo/_base/declare",
    "dojo/topic",
    "./_Partial"
], function(
    declare,
    topic,
    Partial
) {    
    return declare([Partial], {
        
        // constructor args
        router: null,
        request: null,
        
        setPageStyle: function(css) {
            topic.publish('sirprize/dojod/_Page/css', { css: css });
        },
        
        setPageTitle: function(title) {
            topic.publish('sirprize/dojod/_Page/title', { title: title });
        },
        
        handleNotFound: function() {
            topic.publish('sirprize/dojod/_Page/not-found', {});
        }
    });
});
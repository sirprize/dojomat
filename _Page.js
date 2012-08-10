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
            topic.publish('dojod/_Page/css', { css: css });
        },
        
        setPageTitle: function(title) {
            topic.publish('dojod/_Page/title', { title: title });
        },

        setNotification: function(message, type) {
            topic.publish('dojod/_Page/notification', { message: message, type: type });
        },
        
        handleNotFound: function() {
            topic.publish('dojod/_Page/not-found', {});
        },
        
        handleError: function(error) {
            topic.publish('dojod/_Page/error', error);
        }
    });
});
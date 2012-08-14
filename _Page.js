/*jslint browser: true */
/*global define: true */

define([
    "dojo/_base/declare",
    "dojo/topic",
    "./_Widget"
], function (
    declare,
    topic,
    Widget
) {
    "use strict";

    return declare([Widget], {

        // constructor args
        router: null,
        request: null,

        setCss: function (css) {
            topic.publish('dojod/_Page/css', { css: css });
        },

        setTitle: function (title) {
            topic.publish('dojod/_Page/title', { title: title });
        },

        setNotification: function (message, type) {
            topic.publish('dojod/_Page/notification', { message: message, type: type });
        },

        handleNotFound: function () {
            topic.publish('dojod/_Page/not-found', {});
        },

        handleError: function (error) {
            topic.publish('dojod/_Page/error', error);
        }
    });
});
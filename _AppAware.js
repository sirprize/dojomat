/*jslint browser: true */
/*global define: true */

define([
    "dojo/_base/declare",
    "dojo/topic"
], function (
    declare,
    topic
) {
    "use strict";

    return declare([], {
        setCss: function (css) {
            topic.publish('dojomat/_AppAware/css', { css: css });
        },

        setTitle: function (title) {
            topic.publish('dojomat/_AppAware/title', { title: title });
        },

        setNotification: function (message, type) {
            topic.publish('dojomat/_AppAware/notification', { message: message, type: type });
        },

        handleNotFound: function () {
            topic.publish('dojomat/_AppAware/not-found', {});
        },

        handleError: function (error) {
            topic.publish('dojomat/_AppAware/error', error);
        }
    });
});
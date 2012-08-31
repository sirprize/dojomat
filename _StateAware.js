/*jslint browser: true */
/*global define: true */

define([
    "dojo/_base/declare",
    "dojo/has",
    "dojo/topic"
], function (
    declare,
    has,
    topic
) {
    "use strict";

    return declare([], {

        push: function (url) {
            if (!has('native-history-state')) {
                window.location = url;
                return;
            }

            topic.publish('dojomat/_StateAware/push-state', {
                state: {},
                title: '',
                url: url
            });
        }
    });
});
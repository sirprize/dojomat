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
        push: function (url) {
            topic.publish('dojomat/_StateAware/push-state', { url: url });
        }
    });
});
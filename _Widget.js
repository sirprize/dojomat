/*jslint browser: true */
/*global define: true */

define([
    "dojo/_base/declare",
    "dojo/has",
    "dojo/topic",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin"
], function (
    declare,
    has,
    topic,
    WidgetBase,
    TemplatedMixin
) {
    "use strict";

    return declare([WidgetBase, TemplatedMixin], {

        go: function (url) {
            if (!has('native-history-state')) {
                window.location = url;
                return;
            }

            topic.publish('dojod/_Widget/push-state', {
                state: {},
                title: '',
                url: url
            });
        }
    });
});
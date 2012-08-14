/*jslint browser: true */
/*global define: true */

define([
    "dojo/_base/declare",
    "dojo/_base/json",
    "dojo/has",
    "dojo/cookie"
], function (
    declare,
    json,
    has,
    cookie
) {
    "use strict";

    return declare([], {
        id: 'dojod-notification',
        
        get: function () {
            if (!has('native-localstorage')) {
                return json.fromJson(localStorage.getItem(this.id));
            }
            return json.fromJson(cookie(this.id));
        },

        clear: function () {
            if (!has('native-localstorage')) {
                localStorage.removeItem(this.id);
            } else {
                cookie(this.id, null, { expires: -1} );
            }
        },

        set: function (notification) {
            if (!has('native-localstorage')) {
                localStorage.setItem(this.id, json.toJson(notification));
            } else {
                cookie(this.id, json.toJson(notification), { expires: 5 });
            }
        }
    });
});
'use strict';

var Js_array = require("rescript/lib/js/js_array.js");

function createEmpty(param) {
  return [];
}

function flatten(arr) {
  return Js_array.reduce((function (a, b) {
                return Js_array.concat(b, a);
              }), [], arr);
}

exports.createEmpty = createEmpty;
exports.flatten = flatten;
/* No side effect */

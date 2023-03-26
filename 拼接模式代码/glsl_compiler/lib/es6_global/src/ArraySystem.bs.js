

import * as Js_array from "../../../../../node_modules/rescript/lib/es6/js_array.js";

function createEmpty(param) {
  return [];
}

function flatten(arr) {
  return Js_array.reduce((function (a, b) {
                return Js_array.concat(b, a);
              }), [], arr);
}

export {
  createEmpty ,
  flatten ,
}
/* No side effect */

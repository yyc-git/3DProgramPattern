

import * as Js_array from "../../../../../../../node_modules/rescript/lib/es6/js_array.js";
import * as Caml_option from "../../../../../../../node_modules/rescript/lib/es6/caml_option.js";
import * as ArraySt$Commonlib from "../ArraySt.bs.js";
import * as NullUtils$Commonlib from "../utils/NullUtils.bs.js";

function createEmpty(hintSizeOpt, param) {
  return [];
}

function copy(prim) {
  return prim.slice();
}

function unsafeGet(map, key) {
  return map[key];
}

function get(map, key) {
  var value = map[key];
  if (NullUtils$Commonlib.isEmpty(value)) {
    return ;
  } else {
    return Caml_option.some(value);
  }
}

function getNullable(map, key) {
  return map[key];
}

function has(map, key) {
  return !NullUtils$Commonlib.isEmpty(map[key]);
}

function map(map$1, func) {
  return Js_array.map((function (value) {
                if (NullUtils$Commonlib.isNotInMap(value)) {
                  return ;
                } else {
                  return func(value);
                }
              }), map$1);
}

function reducei(map, func, initValue) {
  return ArraySt$Commonlib.reduceOneParami(map, (function (previousValue, value, index) {
                if (NullUtils$Commonlib.isNotInMap(value)) {
                  return previousValue;
                } else {
                  return func(previousValue, value, index);
                }
              }), initValue);
}

function getValues(map) {
  return Js_array.filter(NullUtils$Commonlib.isInMap, map);
}

function getKeys(map) {
  return ArraySt$Commonlib.reduceOneParami(map, (function (arr, value, key) {
                if (NullUtils$Commonlib.isNotInMap(value)) {
                  return arr;
                } else {
                  Js_array.push(key, arr);
                  return arr;
                }
              }), []);
}

export {
  createEmpty ,
  copy ,
  unsafeGet ,
  get ,
  getNullable ,
  has ,
  map ,
  reducei ,
  getValues ,
  getKeys ,
}
/* No side effect */

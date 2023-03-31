'use strict';

var Js_array = require("rescript/lib/js/js_array.js");
var Caml_option = require("rescript/lib/js/caml_option.js");
var ArraySt$Commonlib = require("../ArraySt.bs.js");
var NullUtils$Commonlib = require("../utils/NullUtils.bs.js");

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

exports.createEmpty = createEmpty;
exports.copy = copy;
exports.unsafeGet = unsafeGet;
exports.get = get;
exports.getNullable = getNullable;
exports.has = has;
exports.map = map;
exports.reducei = reducei;
exports.getValues = getValues;
exports.getKeys = getKeys;
/* No side effect */

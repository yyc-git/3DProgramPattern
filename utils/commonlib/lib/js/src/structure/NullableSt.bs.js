'use strict';

var Curry = require("rescript/lib/js/curry.js");
var Js_null_undefined = require("rescript/lib/js/js_null_undefined.js");
var OptionSt$Commonlib = require("./OptionSt.bs.js");

function getExn(data) {
  return OptionSt$Commonlib.getExn(OptionSt$Commonlib.fromNullable(data));
}

function $$return(data) {
  return data;
}

function getWithDefault(nullableData, $$default) {
  return OptionSt$Commonlib.getWithDefault(OptionSt$Commonlib.fromNullable(nullableData), $$default);
}

function bind(nullableData, func) {
  return OptionSt$Commonlib.toNullable(OptionSt$Commonlib.bind(OptionSt$Commonlib.fromNullable(nullableData), (function (val) {
                    return OptionSt$Commonlib.fromNullable(Curry._1(func, val));
                  })));
}

function isNullable(prim) {
  return prim == null;
}

var map = Js_null_undefined.bind;

exports.getExn = getExn;
exports.$$return = $$return;
exports.getWithDefault = getWithDefault;
exports.map = map;
exports.bind = bind;
exports.isNullable = isNullable;
/* No side effect */

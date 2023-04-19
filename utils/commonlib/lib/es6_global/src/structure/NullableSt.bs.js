

import * as Curry from "../../../../../../node_modules/rescript/lib/es6/curry.js";
import * as Js_null_undefined from "../../../../../../node_modules/rescript/lib/es6/js_null_undefined.js";
import * as OptionSt$Commonlib from "./OptionSt.bs.js";

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

export {
  getExn ,
  $$return ,
  getWithDefault ,
  map ,
  bind ,
  isNullable ,
}
/* No side effect */

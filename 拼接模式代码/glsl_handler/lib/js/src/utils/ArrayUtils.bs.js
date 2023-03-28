'use strict';

var ArraySt$Commonlib = require("commonlib/lib/js/src/structure/ArraySt.bs.js");
var OptionSt$Commonlib = require("commonlib/lib/js/src/structure/OptionSt.bs.js");

function findFirstExn(arr, func) {
  return OptionSt$Commonlib.getExn(ArraySt$Commonlib.find(arr, func));
}

exports.findFirstExn = findFirstExn;
/* No side effect */

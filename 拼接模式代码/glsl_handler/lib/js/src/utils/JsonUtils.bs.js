'use strict';

var OptionSt$Commonlib = require("commonlib/lib/js/src/structure/OptionSt.bs.js");

function isJsonSerializedValueNone(value) {
  if (value === null) {
    return true;
  } else {
    return value === undefined;
  }
}

var getJsonSerializedValueExn = OptionSt$Commonlib.getExn;

var toNullable = OptionSt$Commonlib.toNullable;

exports.isJsonSerializedValueNone = isJsonSerializedValueNone;
exports.getJsonSerializedValueExn = getJsonSerializedValueExn;
exports.toNullable = toNullable;
/* No side effect */

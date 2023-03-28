

import * as OptionSt$Commonlib from "../../../../../../node_modules/commonlib/lib/es6_global/src/structure/OptionSt.bs.js";

function isJsonSerializedValueNone(value) {
  if (value === null) {
    return true;
  } else {
    return value === undefined;
  }
}

var getJsonSerializedValueExn = OptionSt$Commonlib.getExn;

var toNullable = OptionSt$Commonlib.toNullable;

export {
  isJsonSerializedValueNone ,
  getJsonSerializedValueExn ,
  toNullable ,
}
/* No side effect */

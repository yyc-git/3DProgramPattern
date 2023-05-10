

import * as ArraySt$Commonlib from "../../../../../../node_modules/commonlib/lib/es6_global/src/structure/ArraySt.bs.js";
import * as OptionSt$Commonlib from "../../../../../../node_modules/commonlib/lib/es6_global/src/structure/OptionSt.bs.js";

function findFirstExn(arr, func) {
  return OptionSt$Commonlib.getExn(ArraySt$Commonlib.find(arr, func));
}

export {
  findFirstExn ,
}
/* No side effect */

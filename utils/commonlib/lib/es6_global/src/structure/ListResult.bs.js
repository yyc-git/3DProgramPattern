

import * as ListSt$Commonlib from "./ListSt.bs.js";
import * as Result$Commonlib from "./Result.bs.js";

function mergeResults(resultList) {
  return ListSt$Commonlib.reduce(resultList, Result$Commonlib.succeed(undefined), (function (mergedResult, result) {
                return Result$Commonlib.bind(mergedResult, (function (param) {
                              return result;
                            }));
              }));
}

export {
  mergeResults ,
}
/* No side effect */

'use strict';

var ListSt$Commonlib = require("./ListSt.bs.js");
var Result$Commonlib = require("./Result.bs.js");

function mergeResults(resultList) {
  return ListSt$Commonlib.reduce(resultList, Result$Commonlib.succeed(undefined), (function (mergedResult, result) {
                return Result$Commonlib.bind(mergedResult, (function (param) {
                              return result;
                            }));
              }));
}

exports.mergeResults = mergeResults;
/* No side effect */

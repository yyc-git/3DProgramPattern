

import * as Caml_option from "../../../../../../../node_modules/rescript/lib/es6/caml_option.js";
import * as Result$Commonlib from "../Result.bs.js";
import * as OptionSt$Commonlib from "../OptionSt.bs.js";

function collectOption(optionData1, optionData2, optionData3, optionData4, optionData5, optionData6) {
  if (optionData1 !== undefined && optionData2 !== undefined && optionData3 !== undefined && optionData4 !== undefined && optionData5 !== undefined && optionData6 !== undefined) {
    return Result$Commonlib.succeed([
                Caml_option.valFromOption(optionData1),
                Caml_option.valFromOption(optionData2),
                Caml_option.valFromOption(optionData3),
                Caml_option.valFromOption(optionData4),
                Caml_option.valFromOption(optionData5),
                Caml_option.valFromOption(optionData6)
              ]);
  } else {
    return OptionSt$Commonlib.buildFailResult(undefined);
  }
}

function collectResult(resultData1, resultData2, resultData3, resultData4, resultData5, resultData6) {
  return Result$Commonlib.bind(resultData1, (function (data1) {
                return Result$Commonlib.bind(resultData2, (function (data2) {
                              return Result$Commonlib.bind(resultData3, (function (data3) {
                                            return Result$Commonlib.bind(resultData4, (function (data4) {
                                                          return Result$Commonlib.bind(resultData5, (function (data5) {
                                                                        return Result$Commonlib.mapSuccess(resultData6, (function (data6) {
                                                                                      return [
                                                                                              data1,
                                                                                              data2,
                                                                                              data3,
                                                                                              data4,
                                                                                              data5,
                                                                                              data6
                                                                                            ];
                                                                                    }));
                                                                      }));
                                                        }));
                                          }));
                            }));
              }));
}

export {
  collectOption ,
  collectResult ,
}
/* No side effect */

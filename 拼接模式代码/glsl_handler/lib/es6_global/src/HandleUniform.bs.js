

import * as Curry from "../../../../../node_modules/rescript/lib/es6/curry.js";
import * as ArraySt$Commonlib from "../../../../../node_modules/commonlib/lib/es6_global/src/structure/ArraySt.bs.js";
import * as JsonUtils$Glsl_handler from "./utils/JsonUtils.bs.js";

function addUniformSendData(add, shaderLibs) {
  return ArraySt$Commonlib.reduceOneParam(shaderLibs, (function (sendDataArr, param) {
                var variables = param.variables;
                if (JsonUtils$Glsl_handler.isJsonSerializedValueNone(variables)) {
                  return sendDataArr;
                }
                var match = JsonUtils$Glsl_handler.getJsonSerializedValueExn(variables);
                var uniforms = match.uniforms;
                if (JsonUtils$Glsl_handler.isJsonSerializedValueNone(uniforms)) {
                  return sendDataArr;
                } else {
                  return ArraySt$Commonlib.reduceOneParam(JsonUtils$Glsl_handler.getJsonSerializedValueExn(uniforms), (function (sendDataArr, param) {
                                return Curry._2(add, sendDataArr, [
                                            param.name,
                                            param.field,
                                            param.type_,
                                            param.from
                                          ]);
                              }), sendDataArr);
                }
              }), []);
}

export {
  addUniformSendData ,
}
/* No side effect */

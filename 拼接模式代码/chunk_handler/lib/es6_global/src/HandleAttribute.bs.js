

import * as Curry from "../../../../../node_modules/rescript/lib/es6/curry.js";
import * as ArraySt$Commonlib from "../../../../../node_modules/commonlib/lib/es6_global/src/structure/ArraySt.bs.js";
import * as JsonUtils$Chunk_handler from "./utils/JsonUtils.bs.js";

function addAttributeSendData(add, shaderLibs) {
  return ArraySt$Commonlib.reduceOneParam(shaderLibs, (function (sendDataArr, param) {
                var variables = param.variables;
                if (JsonUtils$Chunk_handler.isJsonSerializedValueNone(variables)) {
                  return sendDataArr;
                }
                var match = JsonUtils$Chunk_handler.getJsonSerializedValueExn(variables);
                var attributes = match.attributes;
                if (JsonUtils$Chunk_handler.isJsonSerializedValueNone(attributes)) {
                  return sendDataArr;
                } else {
                  return ArraySt$Commonlib.reduceOneParam(JsonUtils$Chunk_handler.getJsonSerializedValueExn(attributes), (function (sendDataArr, param) {
                                return Curry._2(add, sendDataArr, [
                                            JsonUtils$Chunk_handler.toNullable(param.name),
                                            param.buffer,
                                            JsonUtils$Chunk_handler.toNullable(param.type_)
                                          ]);
                              }), sendDataArr);
                }
              }), []);
}

export {
  addAttributeSendData ,
}
/* No side effect */

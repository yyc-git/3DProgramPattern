

import * as Curry from "../../../../../node_modules/rescript/lib/es6/curry.js";
import * as ArraySt$Commonlib from "../../../../../node_modules/commonlib/lib/es6_global/src/structure/ArraySt.bs.js";
import * as JsonUtils$Chunk_handler from "./utils/JsonUtils.bs.js";

function addUniformSendMetadata(add, shaderChunks) {
  return ArraySt$Commonlib.reduceOneParam(shaderChunks, (function (sendMetadataArr, param) {
                var variables = param.variables;
                if (JsonUtils$Chunk_handler.isJsonSerializedValueNone(variables)) {
                  return sendMetadataArr;
                }
                var match = JsonUtils$Chunk_handler.getJsonSerializedValueExn(variables);
                var uniforms = match.uniforms;
                if (JsonUtils$Chunk_handler.isJsonSerializedValueNone(uniforms)) {
                  return sendMetadataArr;
                } else {
                  return ArraySt$Commonlib.reduceOneParam(JsonUtils$Chunk_handler.getJsonSerializedValueExn(uniforms), (function (sendMetadataArr, param) {
                                return Curry._2(add, sendMetadataArr, [
                                            param.name,
                                            param.field,
                                            param.type_,
                                            param.from
                                          ]);
                              }), sendMetadataArr);
                }
              }), []);
}

export {
  addUniformSendMetadata ,
}
/* No side effect */

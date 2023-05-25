

import * as Curry from "../../../../../node_modules/rescript/lib/es6/curry.js";
import * as ArraySt$Commonlib from "../../../../../node_modules/commonlib/lib/es6_global/src/structure/ArraySt.bs.js";
import * as JsonUtils$Chunk_handler from "./utils/JsonUtils.bs.js";

function addAttributeSendMetadata(add, shaderChunks) {
  return ArraySt$Commonlib.reduceOneParam(shaderChunks, (function (sendMetadataArr, param) {
                var variables = param.variables;
                if (JsonUtils$Chunk_handler.isJsonSerializedValueNone(variables)) {
                  return sendMetadataArr;
                }
                var match = JsonUtils$Chunk_handler.getJsonSerializedValueExn(variables);
                var attributes = match.attributes;
                if (JsonUtils$Chunk_handler.isJsonSerializedValueNone(attributes)) {
                  return sendMetadataArr;
                } else {
                  return ArraySt$Commonlib.reduceOneParam(JsonUtils$Chunk_handler.getJsonSerializedValueExn(attributes), (function (sendMetadataArr, param) {
                                return Curry._2(add, sendMetadataArr, [
                                            JsonUtils$Chunk_handler.toNullable(param.name),
                                            param.buffer,
                                            JsonUtils$Chunk_handler.toNullable(param.type_)
                                          ]);
                              }), sendMetadataArr);
                }
              }), []);
}

export {
  addAttributeSendMetadata ,
}
/* No side effect */

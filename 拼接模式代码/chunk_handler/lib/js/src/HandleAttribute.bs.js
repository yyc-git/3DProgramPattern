'use strict';

var Curry = require("rescript/lib/js/curry.js");
var ArraySt$Commonlib = require("commonlib/lib/js/src/structure/ArraySt.bs.js");
var JsonUtils$Chunk_handler = require("./utils/JsonUtils.bs.js");

function addAttributeSendConfig(add, shaderChunks) {
  return ArraySt$Commonlib.reduceOneParam(shaderChunks, (function (sendDataArr, param) {
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

exports.addAttributeSendConfig = addAttributeSendConfig;
/* No side effect */

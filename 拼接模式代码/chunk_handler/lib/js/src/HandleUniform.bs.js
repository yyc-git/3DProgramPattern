'use strict';

var Curry = require("rescript/lib/js/curry.js");
var ArraySt$Commonlib = require("commonlib/lib/js/src/structure/ArraySt.bs.js");
var JsonUtils$Chunk_handler = require("./utils/JsonUtils.bs.js");

function addUniformSendConfig(add, shaderChunks) {
  return ArraySt$Commonlib.reduceOneParam(shaderChunks, (function (sendDataArr, param) {
                var variables = param.variables;
                if (JsonUtils$Chunk_handler.isJsonSerializedValueNone(variables)) {
                  return sendDataArr;
                }
                var match = JsonUtils$Chunk_handler.getJsonSerializedValueExn(variables);
                var uniforms = match.uniforms;
                if (JsonUtils$Chunk_handler.isJsonSerializedValueNone(uniforms)) {
                  return sendDataArr;
                } else {
                  return ArraySt$Commonlib.reduceOneParam(JsonUtils$Chunk_handler.getJsonSerializedValueExn(uniforms), (function (sendDataArr, param) {
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

exports.addUniformSendConfig = addUniformSendConfig;
/* No side effect */

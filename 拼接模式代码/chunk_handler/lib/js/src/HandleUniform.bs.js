'use strict';

var Curry = require("rescript/lib/js/curry.js");
var ArraySt$Commonlib = require("commonlib/lib/js/src/structure/ArraySt.bs.js");
var JsonUtils$Chunk_handler = require("./utils/JsonUtils.bs.js");

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

exports.addUniformSendMetadata = addUniformSendMetadata;
/* No side effect */

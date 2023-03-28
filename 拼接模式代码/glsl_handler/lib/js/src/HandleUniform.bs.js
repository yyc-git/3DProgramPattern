'use strict';

var Curry = require("rescript/lib/js/curry.js");
var ArraySt$Commonlib = require("commonlib/lib/js/src/structure/ArraySt.bs.js");
var JsonUtils$Glsl_handler = require("./utils/JsonUtils.bs.js");

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

exports.addUniformSendData = addUniformSendData;
/* No side effect */

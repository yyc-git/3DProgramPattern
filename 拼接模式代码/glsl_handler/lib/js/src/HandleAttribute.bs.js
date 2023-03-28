'use strict';

var Curry = require("rescript/lib/js/curry.js");
var ArraySt$Commonlib = require("commonlib/lib/js/src/structure/ArraySt.bs.js");
var JsonUtils$Glsl_handler = require("./utils/JsonUtils.bs.js");

function addAttributeSendData(add, shaderLibs) {
  return ArraySt$Commonlib.reduceOneParam(shaderLibs, (function (sendDataArr, param) {
                var variables = param.variables;
                if (JsonUtils$Glsl_handler.isJsonSerializedValueNone(variables)) {
                  return sendDataArr;
                }
                var match = JsonUtils$Glsl_handler.getJsonSerializedValueExn(variables);
                var attributes = match.attributes;
                if (JsonUtils$Glsl_handler.isJsonSerializedValueNone(attributes)) {
                  return sendDataArr;
                } else {
                  return ArraySt$Commonlib.reduceOneParam(JsonUtils$Glsl_handler.getJsonSerializedValueExn(attributes), (function (sendDataArr, param) {
                                return Curry._2(add, sendDataArr, [
                                            JsonUtils$Glsl_handler.toNullable(param.name),
                                            param.buffer,
                                            JsonUtils$Glsl_handler.toNullable(param.type_)
                                          ]);
                              }), sendDataArr);
                }
              }), []);
}

exports.addAttributeSendData = addAttributeSendData;
/* No side effect */

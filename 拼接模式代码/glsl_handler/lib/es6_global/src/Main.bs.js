

import * as ArraySt$Commonlib from "../../../../../node_modules/commonlib/lib/es6_global/src/structure/ArraySt.bs.js";
import * as HandleUniform$Glsl_handler from "./HandleUniform.bs.js";
import * as HandleAttribute$Glsl_handler from "./HandleAttribute.bs.js";
import * as ParseGLSLConfig$Glsl_handler from "./ParseGLSLConfig.bs.js";
import * as HandleShaderLibs$Glsl_handler from "./HandleShaderLibs.bs.js";

function parseGLSLConfig(shadersJson, shaderLibsJson) {
  return [
          ParseGLSLConfig$Glsl_handler.parseShaders(shadersJson),
          ParseGLSLConfig$Glsl_handler.parseShaderLibs(shaderLibsJson)
        ];
}

function buildGLSL(param, shaders, shaderLibs) {
  var match = param[0];
  var shaderLibDataOfAllShaders = HandleShaderLibs$Glsl_handler.getShaderLibsOfShaders([
        [
          match[0],
          match[1]
        ],
        param[1]
      ], shaders.shaders, shaders, shaderLibs);
  console.log(shaderLibDataOfAllShaders);
  return shaderLibDataOfAllShaders;
}

function getSendDataOfAllMaterialShaders(param, shaderLibDataOfAllShaders) {
  var addUniformSendData = param[1];
  var addAttributeSendData = param[0];
  return ArraySt$Commonlib.map(shaderLibDataOfAllShaders, (function (param) {
                var shaderLibs = param[1];
                return [
                        param[0],
                        [
                          HandleAttribute$Glsl_handler.addAttributeSendData(addAttributeSendData, shaderLibs),
                          HandleUniform$Glsl_handler.addUniformSendData(addUniformSendData, shaderLibs)
                        ]
                      ];
              }));
}

export {
  parseGLSLConfig ,
  buildGLSL ,
  getSendDataOfAllMaterialShaders ,
}
/* No side effect */

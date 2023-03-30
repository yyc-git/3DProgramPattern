

import * as BuildGLSL$Glsl_handler from "./BuildGLSL.bs.js";
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

function buildGLSL(param, shaders, shaderName, shaderLibs, chunk, precision) {
  var match = param[1];
  var match$1 = param[0];
  var match$2 = match$1[0];
  var shaderLibs$1 = HandleShaderLibs$Glsl_handler.getShaderLibsOfShader([
        [
          match$2[0],
          match$2[1]
        ],
        match$1[1]
      ], shaders.shaders, shaderName, shaders, shaderLibs);
  return [
          shaderLibs$1,
          BuildGLSL$Glsl_handler.buildGLSL([
                match[0],
                match[1],
                match[2],
                match[3]
              ], shaderLibs$1, chunk, precision)
        ];
}

function getSendData(param, shaderLibs) {
  return [
          HandleAttribute$Glsl_handler.addAttributeSendData(param[0], shaderLibs),
          HandleUniform$Glsl_handler.addUniformSendData(param[1], shaderLibs)
        ];
}

export {
  parseGLSLConfig ,
  buildGLSL ,
  getSendData ,
}
/* No side effect */



import * as ParseGLSLConfig$Glsl_handler from "./ParseGLSLConfig.bs.js";
import * as HandleShaderLibs$Glsl_handler from "./HandleShaderLibs.bs.js";

function parseGLSLConfig(shadersJson, shaderLibsJson) {
  return [
          ParseGLSLConfig$Glsl_handler.parseShaders(shadersJson),
          ParseGLSLConfig$Glsl_handler.parseShaderLibs(shaderLibsJson)
        ];
}

function handleGLSL(param, shaders, shaderLibs) {
  var isPassForDynamicBranch = param[1];
  var match = param[0];
  var getShaderLibFromStaticBranch = match[1];
  var isNameValidForStaticBranch = match[0];
  var materialShaderLibs = HandleShaderLibs$Glsl_handler.getShaderLibsOfShaders([
        [
          isNameValidForStaticBranch,
          getShaderLibFromStaticBranch
        ],
        isPassForDynamicBranch
      ], shaders.materialShaders, shaders, shaderLibs);
  var noMaterialShaderLibs = HandleShaderLibs$Glsl_handler.getShaderLibsOfShaders([
        [
          isNameValidForStaticBranch,
          getShaderLibFromStaticBranch
        ],
        isPassForDynamicBranch
      ], shaders.noMaterialShaders, shaders, shaderLibs);
  console.log(materialShaderLibs);
  console.log(noMaterialShaderLibs);
}

export {
  parseGLSLConfig ,
  handleGLSL ,
}
/* No side effect */

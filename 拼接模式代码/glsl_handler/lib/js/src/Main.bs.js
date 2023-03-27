'use strict';

var ParseGLSLConfig$Glsl_handler = require("./ParseGLSLConfig.bs.js");
var HandleShaderLibs$Glsl_handler = require("./HandleShaderLibs.bs.js");

function handleGLSL(param, shadersJson, shaderLibsJson) {
  var isPassForDynamicBranch = param[1];
  var match = param[0];
  var getShaderLibFromStaticBranch = match[1];
  var isNameValidForStaticBranch = match[0];
  var shaders = ParseGLSLConfig$Glsl_handler.parseShaders(shadersJson);
  var shaderLibs = ParseGLSLConfig$Glsl_handler.parseShaderLibs(shaderLibsJson);
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

exports.handleGLSL = handleGLSL;
/* No side effect */

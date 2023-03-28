'use strict';

var ArraySt$Commonlib = require("commonlib/lib/js/src/structure/ArraySt.bs.js");
var HandleUniform$Glsl_handler = require("./HandleUniform.bs.js");
var HandleAttribute$Glsl_handler = require("./HandleAttribute.bs.js");
var ParseGLSLConfig$Glsl_handler = require("./ParseGLSLConfig.bs.js");
var HandleShaderLibs$Glsl_handler = require("./HandleShaderLibs.bs.js");

function parseGLSLConfig(shadersJson, shaderLibsJson) {
  return [
          ParseGLSLConfig$Glsl_handler.parseShaders(shadersJson),
          ParseGLSLConfig$Glsl_handler.parseShaderLibs(shaderLibsJson)
        ];
}

function buildGLSL(param, shaders, shaderLibs) {
  var isPassForDynamicBranch = param[1];
  var match = param[0];
  var getShaderLibFromStaticBranch = match[1];
  var isNameValidForStaticBranch = match[0];
  var shaderLibDataOfAllMaterialShaders = HandleShaderLibs$Glsl_handler.getShaderLibsOfShaders([
        [
          isNameValidForStaticBranch,
          getShaderLibFromStaticBranch
        ],
        isPassForDynamicBranch
      ], shaders.materialShaders, shaders, shaderLibs);
  var shaderLibDataOfAllNoMaterialShaders = HandleShaderLibs$Glsl_handler.getShaderLibsOfShaders([
        [
          isNameValidForStaticBranch,
          getShaderLibFromStaticBranch
        ],
        isPassForDynamicBranch
      ], shaders.noMaterialShaders, shaders, shaderLibs);
  console.log(shaderLibDataOfAllMaterialShaders);
  console.log(shaderLibDataOfAllNoMaterialShaders);
  return [
          shaderLibDataOfAllMaterialShaders,
          shaderLibDataOfAllNoMaterialShaders
        ];
}

function getSendDataOfAllMaterialShaders(param, shaderLibDataOfAllMaterialShaders) {
  var addUniformSendData = param[1];
  var addAttributeSendData = param[0];
  return ArraySt$Commonlib.map(shaderLibDataOfAllMaterialShaders, (function (param) {
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

exports.parseGLSLConfig = parseGLSLConfig;
exports.buildGLSL = buildGLSL;
exports.getSendDataOfAllMaterialShaders = getSendDataOfAllMaterialShaders;
/* No side effect */

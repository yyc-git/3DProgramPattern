'use strict';

var ArraySt$Commonlib = require("commonlib/lib/js/src/structure/ArraySt.bs.js");
var BuildGLSL$Glsl_handler = require("./BuildGLSL.bs.js");
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

function buildGLSL(param, shaders, shaderLibs, shaderChunk, precision) {
  var match = param[1];
  var buildGLSLChunkInFS = match[3];
  var buildGLSLChunkInVS = match[2];
  var generateUniformType = match[1];
  var generateAttributeType = match[0];
  var match$1 = param[0];
  var match$2 = match$1[0];
  var shaderLibDataOfAllShaders = HandleShaderLibs$Glsl_handler.getShaderLibsOfShaders([
        [
          match$2[0],
          match$2[1]
        ],
        match$1[1]
      ], shaders.shaders, shaders, shaderLibs);
  return [
          shaderLibDataOfAllShaders,
          ArraySt$Commonlib.map(shaderLibDataOfAllShaders, (function (param) {
                  return [
                          param[0],
                          BuildGLSL$Glsl_handler.buildGLSL([
                                generateAttributeType,
                                generateUniformType,
                                buildGLSLChunkInVS,
                                buildGLSLChunkInFS
                              ], param[1], shaderChunk, precision)
                        ];
                }))
        ];
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

exports.parseGLSLConfig = parseGLSLConfig;
exports.buildGLSL = buildGLSL;
exports.getSendDataOfAllMaterialShaders = getSendDataOfAllMaterialShaders;
/* No side effect */

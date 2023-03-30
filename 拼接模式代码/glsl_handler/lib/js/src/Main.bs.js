'use strict';

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

exports.parseGLSLConfig = parseGLSLConfig;
exports.buildGLSL = buildGLSL;
exports.getSendData = getSendData;
/* No side effect */

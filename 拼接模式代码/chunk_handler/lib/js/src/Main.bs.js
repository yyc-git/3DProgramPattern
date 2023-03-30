'use strict';

var BuildGLSL$Chunk_handler = require("./BuildGLSL.bs.js");
var HandleUniform$Chunk_handler = require("./HandleUniform.bs.js");
var HandleAttribute$Chunk_handler = require("./HandleAttribute.bs.js");
var ParseGLSLConfig$Chunk_handler = require("./ParseGLSLConfig.bs.js");
var HandleShaderLibs$Chunk_handler = require("./HandleShaderLibs.bs.js");

function parseGLSLConfig(shadersJson, shaderLibsJson) {
  return [
          ParseGLSLConfig$Chunk_handler.parseShaders(shadersJson),
          ParseGLSLConfig$Chunk_handler.parseShaderLibs(shaderLibsJson)
        ];
}

function buildGLSL(param, shaders, shaderLibs, chunk, shaderName, precision) {
  var match = param[1];
  var match$1 = param[0];
  var match$2 = match$1[0];
  var shaderLibs$1 = HandleShaderLibs$Chunk_handler.getShaderLibsOfShader([
        [
          match$2[0],
          match$2[1]
        ],
        match$1[1]
      ], shaders.shaders, shaderName, shaders, shaderLibs);
  return [
          shaderLibs$1,
          BuildGLSL$Chunk_handler.buildGLSL([
                match[0],
                match[1],
                match[2],
                match[3]
              ], shaderLibs$1, chunk, precision)
        ];
}

function getSendData(param, shaderLibs) {
  return [
          HandleAttribute$Chunk_handler.addAttributeSendData(param[0], shaderLibs),
          HandleUniform$Chunk_handler.addUniformSendData(param[1], shaderLibs)
        ];
}

exports.parseGLSLConfig = parseGLSLConfig;
exports.buildGLSL = buildGLSL;
exports.getSendData = getSendData;
/* No side effect */



import * as BuildGLSL$Chunk_handler from "./BuildGLSL.bs.js";
import * as HandleUniform$Chunk_handler from "./HandleUniform.bs.js";
import * as HandleAttribute$Chunk_handler from "./HandleAttribute.bs.js";
import * as ParseGLSLConfig$Chunk_handler from "./ParseGLSLConfig.bs.js";
import * as HandleShaderLibs$Chunk_handler from "./HandleShaderLibs.bs.js";

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

export {
  parseGLSLConfig ,
  buildGLSL ,
  getSendData ,
}
/* No side effect */

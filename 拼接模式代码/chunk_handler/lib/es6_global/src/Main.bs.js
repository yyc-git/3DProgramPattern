

import * as BuildGLSL$Chunk_handler from "./BuildGLSL.bs.js";
import * as ParseConfig$Chunk_handler from "./ParseConfig.bs.js";
import * as HandleUniform$Chunk_handler from "./HandleUniform.bs.js";
import * as HandleAttribute$Chunk_handler from "./HandleAttribute.bs.js";
import * as HandleShaderChunks$Chunk_handler from "./HandleShaderChunks.bs.js";

function parseConfig(shadersJson, shaderChunksJson) {
  return [
          ParseConfig$Chunk_handler.parseShaders(shadersJson),
          ParseConfig$Chunk_handler.parseShaderChunks(shaderChunksJson)
        ];
}

function buildGLSL(param, shaders, shaderChunks, chunk, shaderName, precision) {
  var match = param[1];
  var match$1 = param[0];
  var match$2 = match$1[0];
  var shaderChunks$1 = HandleShaderChunks$Chunk_handler.getShaderChunksOfShader([
        [
          match$2[0],
          match$2[1]
        ],
        match$1[1]
      ], shaders.shaders, shaderName, shaders, shaderChunks);
  return [
          shaderChunks$1,
          BuildGLSL$Chunk_handler.buildGLSL([
                match[0],
                match[1],
                match[2],
                match[3]
              ], shaderChunks$1, chunk, precision)
        ];
}

function getSendData(param, shaderChunks) {
  return [
          HandleAttribute$Chunk_handler.addAttributeSendData(param[0], shaderChunks),
          HandleUniform$Chunk_handler.addUniformSendData(param[1], shaderChunks)
        ];
}

export {
  parseConfig ,
  buildGLSL ,
  getSendData ,
}
/* No side effect */

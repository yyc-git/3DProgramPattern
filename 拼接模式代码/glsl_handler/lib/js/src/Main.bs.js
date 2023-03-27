'use strict';

var ParseGLSLConfig$Glsl_handler = require("./ParseGLSLConfig.bs.js");

function parse(shadersJson, shaderLibsJson) {
  return [
          ParseGLSLConfig$Glsl_handler.parseShaders(shadersJson),
          ParseGLSLConfig$Glsl_handler.parseShaderLibs(shaderLibsJson)
        ];
}

exports.parse = parse;
/* No side effect */

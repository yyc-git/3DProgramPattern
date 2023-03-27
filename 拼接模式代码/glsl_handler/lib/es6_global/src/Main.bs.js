

import * as ParseGLSLConfig$Glsl_handler from "./ParseGLSLConfig.bs.js";

function parse(shadersJson, shaderLibsJson) {
  return [
          ParseGLSLConfig$Glsl_handler.parseShaders(shadersJson),
          ParseGLSLConfig$Glsl_handler.parseShaderLibs(shaderLibsJson)
        ];
}

export {
  parse ,
}
/* No side effect */

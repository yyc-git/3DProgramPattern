// let load = LoadGLSLConfig.load

let parse = (shadersJson, shaderLibsJson) => {
  (ParseGLSLConfig.parseShaders(shadersJson), ParseGLSLConfig.parseShaderLibs(shaderLibsJson))
}

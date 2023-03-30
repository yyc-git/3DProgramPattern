let parseConfig = (shadersJson, shaderLibsJson) => {
  (ParseConfig.parseShaders(shadersJson), ParseConfig.parseShaderLibs(shaderLibsJson))
}

let buildGLSL = (
  (
    ((isNameValidForStaticBranch, getShaderLibFromStaticBranch), isPassForDynamicBranch),
    (generateAttributeType, generateUniformType, buildGLSLChunkInVS, buildGLSLChunkInFS),
  ),
  shaders: GLSLConfigType.shaders,
  shaderLibs: GLSLConfigType.shaderLibs,
  chunk,
  shaderName: GLSLConfigType.shaderName,
  precision,
): (GLSLConfigType.shaderLibs, (string, string)) => {
  let shaderLibs = HandleShaderLibs.getShaderLibsOfShader(
    ((isNameValidForStaticBranch, getShaderLibFromStaticBranch), isPassForDynamicBranch),
    shaders.shaders,
    shaderName,
    shaders,
    shaderLibs,
  )

  (
    shaderLibs,
    BuildGLSL.buildGLSL(
      (generateAttributeType, generateUniformType, buildGLSLChunkInVS, buildGLSLChunkInFS),
      shaderLibs,
      chunk,
      precision,
    ),
  )
}

let getSendData = (
  (addAttributeSendData, addUniformSendData),
  shaderLibs: GLSLConfigType.shaderLibs,
) => {
  (
    HandleAttribute.addAttributeSendData(addAttributeSendData, shaderLibs),
    HandleUniform.addUniformSendData(addUniformSendData, shaderLibs),
  )
}

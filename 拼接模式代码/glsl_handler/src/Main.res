let parseGLSLConfig = (shadersJson, shaderLibsJson) => {
  (ParseGLSLConfig.parseShaders(shadersJson), ParseGLSLConfig.parseShaderLibs(shaderLibsJson))
}

let buildGLSL = (
  (
    ((isNameValidForStaticBranch, getShaderLibFromStaticBranch), isPassForDynamicBranch),
    (generateAttributeType, generateUniformType, buildGLSLChunkInVS, buildGLSLChunkInFS),
  ),
  shaders: GLSLConfigType.shaders,
  shaderName: GLSLConfigType.shaderName,
  shaderLibs: GLSLConfigType.shaderLibs,
  shaderChunk,
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
      shaderChunk,
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

let parseConfig = (shadersJson, shaderChunksJson) => {
  (ParseConfig.parseShaders(shadersJson), ParseConfig.parseShaderChunks(shaderChunksJson))
}

let buildGLSL = (
  (
    ((isNameValidForStaticBranch, getShaderChunkFromStaticBranch), isPassForDynamicBranch),
    (generateAttributeType, generateUniformType, buildGLSLChunkInVS, buildGLSLChunkInFS),
  ),
  shaders: GLSLConfigType.shaders,
  shaderChunks: GLSLConfigType.shaderChunks,
  chunk,
  shaderName: GLSLConfigType.shaderName,
  precision,
): (GLSLConfigType.shaderChunks, (string, string)) => {
  let shaderChunks = HandleShaderChunks.getShaderChunksOfShader(
    ((isNameValidForStaticBranch, getShaderChunkFromStaticBranch), isPassForDynamicBranch),
    shaders.shaders,
    shaderName,
    shaders,
    shaderChunks,
  )

  (
    shaderChunks,
    BuildGLSL.buildGLSL(
      (generateAttributeType, generateUniformType, buildGLSLChunkInVS, buildGLSLChunkInFS),
      shaderChunks,
      chunk,
      precision,
    ),
  )
}

let getSendData = (
  (addAttributeSendData, addUniformSendData),
  shaderChunks: GLSLConfigType.shaderChunks,
) => {
  (
    HandleAttribute.addAttributeSendData(addAttributeSendData, shaderChunks),
    HandleUniform.addUniformSendData(addUniformSendData, shaderChunks),
  )
}

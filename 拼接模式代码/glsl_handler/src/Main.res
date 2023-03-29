let parseGLSLConfig = (shadersJson, shaderLibsJson) => {
  (ParseGLSLConfig.parseShaders(shadersJson), ParseGLSLConfig.parseShaderLibs(shaderLibsJson))
}

let buildGLSL = (
  (
    ((isNameValidForStaticBranch, getShaderLibFromStaticBranch), isPassForDynamicBranch),
    (generateAttributeType, generateUniformType, buildGLSLChunkInVS, buildGLSLChunkInFS),
  ),
  shaders: GLSLConfigType.shaders,
  shaderLibs: GLSLConfigType.shaderLibs,
  shaderChunk,
  precision,
): (
  array<(GLSLConfigType.shaderName, GLSLConfigType.shaderLibs)>,
  array<(GLSLConfigType.shaderName, (string, string))>,
) => {
  let shaderLibDataOfAllShaders = HandleShaderLibs.getShaderLibsOfShaders(
    ((isNameValidForStaticBranch, getShaderLibFromStaticBranch), isPassForDynamicBranch),
    shaders.shaders,
    shaders,
    shaderLibs,
  )

  (
    shaderLibDataOfAllShaders,
    shaderLibDataOfAllShaders->Commonlib.ArraySt.map(((shaderName, shaderLibs)) => {
      (
        shaderName,
        BuildGLSL.buildGLSL(
          (generateAttributeType, generateUniformType, buildGLSLChunkInVS, buildGLSLChunkInFS),
          shaderLibs,
          shaderChunk,
          precision,
        ),
      )
    }),
  )
}

let getSendDataOfAllMaterialShaders = (
  (addAttributeSendData, addUniformSendData),
  shaderLibDataOfAllShaders: array<(GLSLConfigType.shaderName, GLSLConfigType.shaderLibs)>,
) => {
  shaderLibDataOfAllShaders->Commonlib.ArraySt.map(((shaderName, shaderLibs)) => {
    (
      shaderName,
      (
        HandleAttribute.addAttributeSendData(addAttributeSendData, shaderLibs),
        HandleUniform.addUniformSendData(addUniformSendData, shaderLibs),
      ),
    )
  })
}

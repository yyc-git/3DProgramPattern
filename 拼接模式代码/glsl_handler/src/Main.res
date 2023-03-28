let parseGLSLConfig = (shadersJson, shaderLibsJson) => {
  (ParseGLSLConfig.parseShaders(shadersJson), ParseGLSLConfig.parseShaderLibs(shaderLibsJson))
}

let buildGLSL = (
  ((isNameValidForStaticBranch, getShaderLibFromStaticBranch), isPassForDynamicBranch),
  shaders: GLSLConfigType.shaders,
  shaderLibs: GLSLConfigType.shaderLibs,
) => {
  let shaderLibDataOfAllShaders = HandleShaderLibs.getShaderLibsOfShaders(
    ((isNameValidForStaticBranch, getShaderLibFromStaticBranch), isPassForDynamicBranch),
    shaders.shaders,
    shaders,
    shaderLibs,
  )

  Js.log(shaderLibDataOfAllShaders)

  shaderLibDataOfAllShaders
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

  // TODO handle shaderLibDataOfAllNoMaterialShaders
}

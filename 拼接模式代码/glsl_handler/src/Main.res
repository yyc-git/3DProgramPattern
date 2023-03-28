let parseGLSLConfig = (shadersJson, shaderLibsJson) => {
  (ParseGLSLConfig.parseShaders(shadersJson), ParseGLSLConfig.parseShaderLibs(shaderLibsJson))
}

let buildGLSL = (
  ((isNameValidForStaticBranch, getShaderLibFromStaticBranch), isPassForDynamicBranch),
  shaders: GLSLConfigType.shaders,
  shaderLibs: GLSLConfigType.shaderLibs,
) => {
  let shaderLibDataOfAllMaterialShaders = HandleShaderLibs.getShaderLibsOfShaders(
    ((isNameValidForStaticBranch, getShaderLibFromStaticBranch), isPassForDynamicBranch),
    shaders.materialShaders,
    shaders,
    shaderLibs,
  )

  let shaderLibDataOfAllNoMaterialShaders = HandleShaderLibs.getShaderLibsOfShaders(
    ((isNameValidForStaticBranch, getShaderLibFromStaticBranch), isPassForDynamicBranch),
    shaders.noMaterialShaders,
    shaders,
    shaderLibs,
  )

  Js.log(shaderLibDataOfAllMaterialShaders)
  Js.log(shaderLibDataOfAllNoMaterialShaders)

  (shaderLibDataOfAllMaterialShaders, shaderLibDataOfAllNoMaterialShaders)
}

let getSendDataOfAllMaterialShaders = (
  (addAttributeSendData, addUniformSendData),
  shaderLibDataOfAllMaterialShaders: array<(GLSLConfigType.shaderName, GLSLConfigType.shaderLibs)>,
) => {
  shaderLibDataOfAllMaterialShaders->Commonlib.ArraySt.map(((shaderName, shaderLibs)) => {
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

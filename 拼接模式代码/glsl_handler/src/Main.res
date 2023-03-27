let parseGLSLConfig = (shadersJson, shaderLibsJson) => {
  (ParseGLSLConfig.parseShaders(shadersJson), ParseGLSLConfig.parseShaderLibs(shaderLibsJson))
}

let handleGLSL = (
  ((isNameValidForStaticBranch, getShaderLibFromStaticBranch), isPassForDynamicBranch),
  shaders: GLSLConfigType.shaders,
  shaderLibs: GLSLConfigType.shaderLibs,
) => {
  let materialShaderLibs = HandleShaderLibs.getShaderLibsOfShaders(
    ((isNameValidForStaticBranch, getShaderLibFromStaticBranch), isPassForDynamicBranch),
    shaders.materialShaders,
    shaders,
    shaderLibs,
  )

  let noMaterialShaderLibs = HandleShaderLibs.getShaderLibsOfShaders(
    ((isNameValidForStaticBranch, getShaderLibFromStaticBranch), isPassForDynamicBranch),
    shaders.noMaterialShaders,
    shaders,
    shaderLibs,
  )

  Js.log(materialShaderLibs)
  Js.log(noMaterialShaderLibs)
}

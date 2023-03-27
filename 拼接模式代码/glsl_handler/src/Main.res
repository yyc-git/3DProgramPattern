let handleGLSL = (
  ((isNameValidForStaticBranch, getShaderLibFromStaticBranch), isPassForDynamicBranch),
  shadersJson,
  shaderLibsJson,
) => {
  let (shaders, shaderLibs) = (
    ParseGLSLConfig.parseShaders(shadersJson),
    ParseGLSLConfig.parseShaderLibs(shaderLibsJson),
  )

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

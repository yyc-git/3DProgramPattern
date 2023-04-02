open GLSLConfigType

let _findFirstShaderChunkExn = (shaderChunkName: string, shaderChunks: shaderChunks): shaderChunk =>
  ArrayUtils.findFirstExn(shaderChunks, (item: shaderChunk) => item.name === shaderChunkName)

let _getShaderChunksByGroup = (resultShaderChunks, groups: groups, name, shaderChunks) =>
  Js.Array.concat(
    ArrayUtils.findFirstExn(groups, item =>
      item.name === name
    ).value->Js.Array.map((name: string) => _findFirstShaderChunkExn(name, shaderChunks), _),
    resultShaderChunks,
  )

let _getShaderChunksByStaticBranch = (
  resultShaderChunks,
  (isNameValid, getShaderChunk),
  name,
  (staticBranchs: staticBranchs, shaderChunks: shaderChunks),
) => {
  isNameValid(name)
    ? {
        let {value}: shaderMapData = ArrayUtils.findFirstExn(staticBranchs, item =>
          item.name === name
        )

        resultShaderChunks->Commonlib.ArraySt.push(
          _findFirstShaderChunkExn(getShaderChunk(name, value), shaderChunks),
        )
      }
    : {
        Commonlib.Log.debug(
          Commonlib.Log.buildDebugJsonMessage(~description=j`staticBranchs`, ~var=staticBranchs),
          true,
        )
        Commonlib.Exception.throwErr(
          Commonlib.Exception.buildErr(
            Commonlib.Log.buildFatalMessage(
              ~title="_getShaderChunksByStaticBranch",
              ~description=j`unknown name:$name`,
              ~reason="",
              ~solution=j``,
              ~params=j``,
            ),
          ),
        )
      }
}

let _getShaderChunksByBynamicBranch = (
  resultShaderChunks,
  isPass,
  name,
  (dynamicBranchs: dynamicBranchs, shaderChunks),
) => {
  let {condition} as dynamicBranchData: dynamicBranchData = ArrayUtils.findFirstExn(
    dynamicBranchs,
    item => item.name === name,
  )

  let dynamicBranchShaderChunkNameOption = isPass(condition)
    ? dynamicBranchData.pass
    : dynamicBranchData.fail

  dynamicBranchShaderChunkNameOption->JsonUtils.isJsonSerializedValueNone
    ? resultShaderChunks
    : resultShaderChunks->Commonlib.ArraySt.push(
        _findFirstShaderChunkExn(
          dynamicBranchShaderChunkNameOption->JsonUtils.getJsonSerializedValueExn,
          shaderChunks,
        ),
      )
}

let _getShaderChunksByType = (
  resultShaderChunks,
  ((isNameValidForStaticBranch, getShaderChunkFromStaticBranch), isPassForDynamicBranch),
  (type_: shaderChunkItemType, groups: groups, name: shaderChunkItemName),
  (shaderChunks: shaderChunks, staticBranchs, dynamicBranchs),
): shaderChunks => {
  switch type_ {
  | "group" => _getShaderChunksByGroup(resultShaderChunks, groups, name, shaderChunks)
  | "static_branch" =>
    _getShaderChunksByStaticBranch(
      resultShaderChunks,
      (isNameValidForStaticBranch, getShaderChunkFromStaticBranch),
      name,
      (staticBranchs, shaderChunks),
    )
  | "dynamic_branch" =>
    _getShaderChunksByBynamicBranch(
      resultShaderChunks,
      isPassForDynamicBranch,
      name,
      (dynamicBranchs, shaderChunks),
    )
  | _ =>
    Commonlib.Log.debug(
      Commonlib.Log.buildDebugJsonMessage(~description=j`shaderChunks`, ~var=shaderChunks),
      true,
    )
    Commonlib.Exception.throwErr(
      Commonlib.Exception.buildErr(
        Commonlib.Log.buildFatalMessage(
          ~title="_getShaderChunksByType",
          ~description=j`unknown type_:$type_`,
          ~reason="",
          ~solution=j``,
          ~params=j``,
        ),
      ),
    )
  }
}

let getShaderChunksOfShader = (
  ((isNameValidForStaticBranch, getShaderChunkFromStaticBranch), isPassForDynamicBranch),
  shaders: array<shader>,
  shaderName: shaderName,
  {staticBranchs, dynamicBranchs, groups}: shaders,
  shaderChunks: shaderChunks,
): shaderChunks => {
  let shader = shaders->ArrayUtils.findFirstExn(({name}) => {
    name === shaderName
  })

  shader.shaderChunks->Commonlib.ArraySt.reduceOneParam((. resultShaderChunks, {type_, name}) => {
    JsonUtils.isJsonSerializedValueNone(type_)
      ? resultShaderChunks->Commonlib.ArraySt.push(_findFirstShaderChunkExn(name, shaderChunks))
      : {
          _getShaderChunksByType(
            resultShaderChunks,
            ((isNameValidForStaticBranch, getShaderChunkFromStaticBranch), isPassForDynamicBranch),
            (type_->JsonUtils.getJsonSerializedValueExn, groups, name),
            (shaderChunks, staticBranchs, dynamicBranchs),
          )
        }
  }, [])
}

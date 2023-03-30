open GLSLConfigType

let _findFirstShaderLibExn = (shaderLibName: string, shaderLibs: shaderLibs): shaderLib =>
  ArrayUtils.findFirstExn(shaderLibs, (item: shaderLib) => item.name === shaderLibName)

let _getShaderLibsByGroup = (resultShaderLibs, groups: groups, name, shaderLibs) =>
  Js.Array.concat(
    ArrayUtils.findFirstExn(groups, item =>
      item.name === name
    ).value->Js.Array.map((name: string) => _findFirstShaderLibExn(name, shaderLibs), _),
    resultShaderLibs,
  )

let _getShaderLibsByStaticBranch = (
  resultShaderLibs,
  (isNameValid, getShaderLib),
  name,
  (staticBranchs: staticBranchs, shaderLibs: shaderLibs),
) => {
  isNameValid(name)
    ? {
        let {value}: shaderMapData = ArrayUtils.findFirstExn(staticBranchs, item =>
          item.name === name
        )

        resultShaderLibs->Commonlib.ArraySt.push(
          _findFirstShaderLibExn(getShaderLib(name, value), shaderLibs),
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
              ~title="_getShaderLibsByStaticBranch",
              ~description=j`unknown name:$name`,
              ~reason="",
              ~solution=j``,
              ~params=j``,
            ),
          ),
        )
      }
}

let _getShaderLibsByBynamicBranch = (
  resultShaderLibs,
  isPass,
  name,
  (dynamicBranchs: dynamicBranchs, shaderLibs),
) => {
  let {condition} as dynamicBranchData: dynamicBranchData = ArrayUtils.findFirstExn(
    dynamicBranchs,
    item => item.name === name,
  )

  let dynamicBranchShaderLibNameOption = isPass(condition)
    ? dynamicBranchData.pass
    : dynamicBranchData.fail

  dynamicBranchShaderLibNameOption->JsonUtils.isJsonSerializedValueNone
    ? resultShaderLibs
    : resultShaderLibs->Commonlib.ArraySt.push(
        _findFirstShaderLibExn(
          dynamicBranchShaderLibNameOption->JsonUtils.getJsonSerializedValueExn,
          shaderLibs,
        ),
      )
}

let _getShaderLibsByType = (
  resultShaderLibs,
  ((isNameValidForStaticBranch, getShaderLibFromStaticBranch), isPassForDynamicBranch),
  (type_: shaderLibItemType, groups: groups, name: shaderLibItemName),
  (shaderLibs: shaderLibs, staticBranchs, dynamicBranchs),
): shaderLibs => {
  switch type_ {
  | "group" => _getShaderLibsByGroup(resultShaderLibs, groups, name, shaderLibs)
  | "static_branch" =>
    _getShaderLibsByStaticBranch(
      resultShaderLibs,
      (isNameValidForStaticBranch, getShaderLibFromStaticBranch),
      name,
      (staticBranchs, shaderLibs),
    )
  | "dynamic_branch" =>
    _getShaderLibsByBynamicBranch(
      resultShaderLibs,
      isPassForDynamicBranch,
      name,
      (dynamicBranchs, shaderLibs),
    )
  | _ =>
    Commonlib.Log.debug(
      Commonlib.Log.buildDebugJsonMessage(~description=j`shaderLibs`, ~var=shaderLibs),
      true,
    )
    Commonlib.Exception.throwErr(
      Commonlib.Exception.buildErr(
        Commonlib.Log.buildFatalMessage(
          ~title="_getShaderLibsByType",
          ~description=j`unknown type_:$type_`,
          ~reason="",
          ~solution=j``,
          ~params=j``,
        ),
      ),
    )
  }
}

let getShaderLibsOfShader = (
  ((isNameValidForStaticBranch, getShaderLibFromStaticBranch), isPassForDynamicBranch),
  shaders: array<shader>,
  shaderName: shaderName,
  {staticBranchs, dynamicBranchs, groups}: shaders,
  shaderLibs: shaderLibs,
): shaderLibs => {
  let shader = shaders->ArrayUtils.findFirstExn(({name}) => {
    name === shaderName
  })

  shader.shaderLibs->Commonlib.ArraySt.reduceOneParam((. resultShaderLibs, {type_, name}) => {
    JsonUtils.isJsonSerializedValueNone(type_)
      ? resultShaderLibs->Commonlib.ArraySt.push(_findFirstShaderLibExn(name, shaderLibs))
      : {
          _getShaderLibsByType(
            resultShaderLibs,
            ((isNameValidForStaticBranch, getShaderLibFromStaticBranch), isPassForDynamicBranch),
            (type_->JsonUtils.getJsonSerializedValueExn, groups, name),
            (shaderLibs, staticBranchs, dynamicBranchs),
          )
        }
  }, [])
}

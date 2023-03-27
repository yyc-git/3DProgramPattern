type shaderLibItemName = string

type shaderLibItemType = string

@genType
type shaderMapDataValue = array<string>

@genType
type shaderMapDataName = string

type shaderMapData = {
  name: shaderMapDataName,
  value: shaderMapDataValue,
}

@genType
type condition = string

type dynamicBranchData = {
  name: string,
  condition: condition,
  pass: option<string>,
  fail: option<string>,
}

type shaderLibItem = {
  type_: option<shaderLibItemType>,
  name: shaderLibItemName,
}

type shaderName = string

type shader = {
  name: shaderName,
  shaderLibs: array<shaderLibItem>,
}

type staticBranchs = array<shaderMapData>
type dynamicBranchs = array<dynamicBranchData>

type groups = array<shaderMapData>

@genType
type shaders = {
  staticBranchs: staticBranchs,
  dynamicBranchs: dynamicBranchs,
  groups: groups,
  materialShaders: array<shader>,
  noMaterialShaders: array<shader>,
}

type glsl = {
  type_: string,
  name: string,
}

type attribute = {
  name: option<string>,
  // buffer: VBOBufferType.bufferEnum,
  buffer: int,
  type_: option<string>,
}

type uniform = {
  name: string,
  field: string,
  type_: string,
  from: string,
}

type variables = {
  uniforms: option<array<uniform>>,
  attributes: option<array<attribute>>,
}

type shaderLib = {
  name: string,
  glsls: option<array<glsl>>,
  variables: option<variables>,
}

@genType
type shaderLibs = array<shaderLib>
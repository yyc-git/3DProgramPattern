type shaderLibItemName = string

type shaderLibItemType = string

type shaderMapDataValue = array<string>

type shaderMapDataName = string

type shaderMapData = {
  name: shaderMapDataName,
  value: shaderMapDataValue,
}

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
  shaders: array<shader>,
}

type glsl = {
  type_: string,
  name: string,
}

type attributeName = string

type attributeType = string

type attributeBuffer = int

type attribute = {
  name: option<attributeName>,
  buffer: attributeBuffer,
  type_: option<attributeType>,
}

type uniformName = string

type uniformField = string

type uniformType = string

type uniformFrom = string

type uniform = {
  name: uniformName,
  field: uniformField,
  type_: uniformType,
  from: uniformFrom,
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

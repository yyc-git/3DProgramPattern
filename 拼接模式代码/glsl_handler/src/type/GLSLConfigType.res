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

type bufferEnum =
  | Vertex
  | Normal
  | TexCoord
  | Index
  | Instance_model_matrix

type attributeName = string

type attributeType = [#vec2 | #vec3 | #vec4]

type attribute = {
  name: option<attributeName>,
  buffer: bufferEnum,
  type_: option<attributeType>,
}

type uniformName = string

// type uniformField = [#mMatrix | #vMatrix | #pMatrix | #color | #alpha | #map]
type uniformField = [#mMatrix | #vMatrix | #pMatrix | #color | #map]

type uniformType = [#mat4 | #float3 | #float | #sampler2D]

type uniformFrom = [#basicMaterial | #model | #camera]

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

type shaderLibs = array<shaderLib>

external intToBufferEnum: int => bufferEnum = "%identity"

external stringToAttributeType: string => attributeType = "%identity"

external stringToUniformField: string => uniformField = "%identity"

external stringToUniformType: string => uniformType = "%identity"

external stringToUniformFrom: string => uniformFrom = "%identity"

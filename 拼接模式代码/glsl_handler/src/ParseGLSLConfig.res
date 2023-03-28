open GLSLConfigType

open Json

let _parseShaderMapData = json => {
  open Json
  open Decode
  json |> array(json => {
    name: json |> field("name", string),
    value: json |> field("value", array(string)),
  })
}

let _parseDynamicBranchData = json => {
  open Json
  open Decode
  json |> array(json => {
    name: json |> field("name", string),
    condition: json |> field("condition", string),
    pass: json |> optional(field("pass", string)),
    fail: json |> optional(field("fail", string)),
  })
}

let parseShaders = shaders => {
  open Json
  open Decode
  let json = shaders
  {
    staticBranchs: json |> field("static_branchs", json => _parseShaderMapData(json)),
    dynamicBranchs: json |> field("dynamic_branchs", json => _parseDynamicBranchData(json)),
    groups: json |> field("groups", json => _parseShaderMapData(json)),
    shaders: json |> field("shaders", json =>
      json |> array((json): shader => {
        name: json |> field("name", string),
        shaderLibs: json |> field(
          "shader_libs",
          array(
            (json): shaderLibItem => {
              type_: json |> optional(field("type", string)),
              name: json |> field("name", string),
            },
          ),
        ),
      })
    ),
  }
}

let _parseGlsl = json => {
  open Json
  open Decode
  json |> optional(
    field("glsls", json =>
      json |> array(json => {
        type_: json |> field("type", string),
        name: json |> field("name", string),
      })
    ),
  )
}

let _parseVariable = json => {
  open Json
  open Decode
  json |> optional(
    field("variables", json => {
      uniforms: json |> optional(
        field("uniforms", json =>
          json |> array(
            json => {
              name: json |> field("name", string),
              field: json |> field("field", string),
              type_: json |> field("type", string),
              from: json |> field("from", string),
            },
          )
        ),
      ),
      attributes: json |> optional(
        field("attributes", json =>
          json |> array(
            json => {
              name: json |> optional(field("name", string)),
              buffer: json |> field("buffer", int),
              type_: json |> optional(field("type", string)),
            },
          )
        ),
      ),
    }),
  )
}

let parseShaderLibs = shaderLibs => {
  open Json
  open Decode
  shaderLibs |> array(json => {
    name: json |> field("name", string),
    glsls: _parseGlsl(json),
    variables: _parseVariable(json),
  })
}

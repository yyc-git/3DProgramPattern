import * as shadersJson from "./glsl_config/shaders.json"
import * as shaderLibsJson from "./glsl_config/shader_libs.json"
import { createState, createMaterial, initBasicMaterialShader } from "splice_pattern_engine/src/Main"

let _fixJsonForArrayBug = (jsonWithArray) => {
    if (Array.isArray(jsonWithArray)) {
        return jsonWithArray
    }

    return (jsonWithArray as any).default
}

let state = createState(shadersJson, _fixJsonForArrayBug(shaderLibsJson))

let materialData = createMaterial(state)
state = materialData[0]
let material = materialData[1]

initBasicMaterialShader(state, material)
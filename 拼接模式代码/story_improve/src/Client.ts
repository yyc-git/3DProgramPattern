import * as shadersJson from "./glsl_config/shaders.json"
import * as shaderLibsJson from "./glsl_config/shader_libs.json"
import { createState, initBasicMaterialShader, render, initCamera } from "splice_pattern_engine/src/Main"
import { createScene } from "splice_pattern_utils/src/Client"

let _fixJsonForArrayBug = (jsonWithArray) => {
    if (Array.isArray(jsonWithArray)) {
        return jsonWithArray
    }

    return (jsonWithArray as any).default
}

let state = createState(shadersJson, _fixJsonForArrayBug(shaderLibsJson))

let sceneData = createScene(state)
state = sceneData[0]
let [allMaterials, _] = sceneData[1]

state = initBasicMaterialShader(state, "render_basic", allMaterials)

state = initCamera(state)

state = render(state)
// use json loader to load config
import * as shadersJson from "./glsl_config/shaders.json"
import * as shaderLibsJson from "./glsl_config/shader_libs.json"

import { createState, initBasicMaterialShader, render, initCamera, parseConfig } from "splice_pattern_engine/src/Main"
import { createScene } from "splice_pattern_utils/src/Client"

//修复json loader关于Array.isArray的bug 
let _fixJsonForArrayBug = (jsonWithArray) => {
    if (Array.isArray(jsonWithArray)) {
        return jsonWithArray
    }

    return (jsonWithArray as any).default
}


let parsedConfig = parseConfig(shadersJson as any, _fixJsonForArrayBug(shaderLibsJson))

let state = createState(parsedConfig)

let sceneData = createScene(state)
state = sceneData[0]
let [allMaterials, _] = sceneData[1]

state = initBasicMaterialShader(state, "render_basic", allMaterials)

state = initCamera(state)

state = render(state)
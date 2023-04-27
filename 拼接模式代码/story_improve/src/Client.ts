// use json loader to load config
import * as shadersJson from "./glsl_config/shaders.json"
import * as shaderChunksJson from "./glsl_config/shader_chunks.json"

import { createState, initBasicMaterialShader, initPBRMaterialShader, render, initCamera, parseConfig } from "splice_pattern_engine/src/Engne"
import { createScene } from "splice_pattern_utils/src/Client"

//修复json loader关于Array.isArray的bug 
let _fixJsonForArrayBug = (jsonWithArray) => {
    if (Array.isArray(jsonWithArray)) {
        return jsonWithArray
    }

    return (jsonWithArray as any).default
}


let parsedConfig = parseConfig(shadersJson as any, _fixJsonForArrayBug(shaderChunksJson))

let state = createState(parsedConfig)

let sceneData = createScene(state)
state = sceneData[0]
let [allBasicMaterials, allPBRMaterials, _] = sceneData[1]

state = initBasicMaterialShader(state, [allBasicMaterials, "render_basic"])

state = initPBRMaterialShader(state, [allPBRMaterials, "render_pbr"])

state = initCamera(state)

state = render(state)
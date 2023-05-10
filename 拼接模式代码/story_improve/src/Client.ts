// use json loader to load config
import * as shadersJson from "./glsl_config/shaders.json"
import * as shaderChunksJson from "./glsl_config/shader_chunks.json"

import * as Engine from "splice_pattern_engine/src/Engne"
import * as ClientUtils from "splice_pattern_utils/src/Client"

//修复json loader关于Array.isArray的bug 
let _fixJsonForArrayBug = (jsonWithArray) => {
    if (Array.isArray(jsonWithArray)) {
        return jsonWithArray
    }

    return (jsonWithArray as any).default
}

let parsedConfig = Engine.parseConfig(shadersJson as any, _fixJsonForArrayBug(shaderChunksJson))

let state = Engine.createState(parsedConfig)

let sceneData = ClientUtils.createScene(state)
state = sceneData[0]
let [allBasicMaterials, allPBRMaterials, _] = sceneData[1]

state = Engine.initBasicMaterialShader(state, [allBasicMaterials, "render_basic"])

state = Engine.initPBRMaterialShader(state, [allPBRMaterials, "render_pbr"])

state = Engine.initCamera(state)

state = Engine.render(state)
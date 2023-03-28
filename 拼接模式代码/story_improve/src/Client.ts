import * as shadersJson from "./glsl_config/shaders.json"
import * as shaderLibsJson from "./glsl_config/shader_libs.json"
import { createState, createMaterial, initBasicMaterialShader, render, createTransform, setFakeTransformData, setFakeMaterialData, initCamera } from "splice_pattern_engine/src/Main"

let _fixJsonForArrayBug = (jsonWithArray) => {
    if (Array.isArray(jsonWithArray)) {
        return jsonWithArray
    }

    return (jsonWithArray as any).default
}

let _createScene = (state) => {
    let materialData = createMaterial(state)
    state = materialData[0]
    let material = materialData[1]

    state = setFakeMaterialData(state, material)


    let transformData = createTransform(state)
    state = transformData[0]
    let transform = transformData[1]

    state = setFakeTransformData(state, transform)

    return [
        state,
        [material, transform]
    ]
}

let state = createState(shadersJson, _fixJsonForArrayBug(shaderLibsJson))


let sceneData = _createScene(state)
state = sceneData[0]
let [material, transform] = sceneData[1]

state = initBasicMaterialShader(state, material)

state = initCamera(state)

state = render(state)
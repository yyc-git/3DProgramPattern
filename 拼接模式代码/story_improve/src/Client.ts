import * as shadersJson from "./glsl_config/shaders.json"
import * as shaderLibsJson from "./glsl_config/shader_libs.json"
import { createState, createMaterial, initBasicMaterialShader, render, createTransform, setFakeTransformData, initCamera, setMaterialFakeMap } from "splice_pattern_engine/src/Main"

let _fixJsonForArrayBug = (jsonWithArray) => {
    if (Array.isArray(jsonWithArray)) {
        return jsonWithArray
    }

    return (jsonWithArray as any).default
}

let _createScene = (state) => {
    let materialData1 = createMaterial(state)
    state = materialData1[0]
    let material1 = materialData1[1]

    state = setMaterialFakeMap(state, material1)


    let materialData2 = createMaterial(state)
    state = materialData2[0]
    let material2 = materialData2[1]



    let transformData = createTransform(state)
    state = transformData[0]
    let transform = transformData[1]

    state = setFakeTransformData(state, transform)

    return [
        state,
        [
            [material1, material2],
            [transform]
        ]
    ]
}

let state = createState(shadersJson, _fixJsonForArrayBug(shaderLibsJson))


let sceneData = _createScene(state)
state = sceneData[0]
let [allMaterials, _] = sceneData[1]

state = initBasicMaterialShader(state, "render_basic", allMaterials)

state = initCamera(state)

state = render(state)
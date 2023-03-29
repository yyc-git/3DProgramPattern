import * as shadersJson from "./glsl_config/shaders.json"
import * as shaderLibsJson from "./glsl_config/shader_libs.json"
import { createState, initXxxMaterialShader, render } from "splice_pattern_engine_abstract/src/Main"
import { state } from "splice_pattern_engine_abstract/src/MainStateType"

type allMaterials = Array<any>
type allTransforms = Array<any>

declare function createScene(state: state): [state, [allMaterials, allTransforms]]

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


declare let xxxMaterialShaderName

state = initXxxMaterialShader(state, xxxMaterialShaderName, allMaterials)

state = render(state)
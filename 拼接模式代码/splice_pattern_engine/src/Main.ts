import * as BasicMaterial from "./BasicMaterial"
import { handleGLSL, parseGLSLConfig } from "glsl_handler"
import { state } from "./MainStateType"
import { material } from "./BasicMaterialStateType"
import { curry3_1, curry3_2 } from "fp/src/Curry"
import { getShaderLibFromStaticBranch, isNameValidForStaticBranch, isPassForDynamicBranch } from "./BasicMaterialShader"

export let createState = (shadersJson, shaderLibsJson): state => {
    let [shaders, shaderLibs] = parseGLSLConfig(shadersJson, shaderLibsJson)

    return {
        shaders,
        shaderLibs,
        basicMaterialState: BasicMaterial.createState()
    }
}

export let createMaterial = (state: state): [state, material] => {
    let materialData = BasicMaterial.createMaterial(state.basicMaterialState)
    let basicMaterialState = materialData[0]
    let material = materialData[1]

    return [
        {
            ...state,
            basicMaterialState: basicMaterialState
        },
        material
    ]
}

export let initBasicMaterialShader = (state: state, material: material) => {
    handleGLSL(
        [
            [
                isNameValidForStaticBranch,
                curry3_1(getShaderLibFromStaticBranch)(state.basicMaterialState)
            ],
            curry3_2(isPassForDynamicBranch)(material, state.basicMaterialState)
        ],
        state.shaders,
        state.shaderLibs
    )


    console.log("继续其它的逻辑，如创建shader对象等。。。。。。。")
}
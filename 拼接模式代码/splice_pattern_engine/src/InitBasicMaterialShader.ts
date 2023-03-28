import { getSendDataOfAllMaterialShaders, buildGLSL } from "glsl_handler"
import { state } from "./MainStateType"
import { material } from "./BasicMaterialStateType"
import { curry3_1, curry3_2 } from "fp/src/Curry"
import { getShaderLibFromStaticBranch, isNameValidForStaticBranch, isPassForDynamicBranch } from "./BasicMaterialShader"
import { addAttributeSendData } from "./BasicMaterialShaderAttributeSender"
import { addUniformSendData } from "./BasicMaterialShaderUniformSender"
import { Map } from "immutable"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"

let _createFakePrograms = (shaderLibDataOfAllShaders) => {
    // TODO use glsl after build
    // console.log("使用GLSL创建shader和program...")

    return shaderLibDataOfAllShaders.reduce((programMap, [shaderName, _]) => {
        let fakeProgram = {} as any as WebGLProgram

        return programMap.set(shaderName, fakeProgram)
    }, Map())
}

export let initBasicMaterialShader = (state: state, material: material): state => {
    let shaderLibDataOfAllShaders = buildGLSL(
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

    let programMap = _createFakePrograms(shaderLibDataOfAllShaders)

    let sendData = getSendDataOfAllMaterialShaders(
        [(sendDataArr, [name, buffer, type]) => {
            return addAttributeSendData(state.gl, getExnFromStrictNull(programMap.get(name)), sendDataArr, [name, buffer, type])
        }, (sendDataArr, [name, field, type, from]) => {
            return addUniformSendData(state.gl, getExnFromStrictNull(programMap.get(name)), sendDataArr, [name, field, type, from])
        }],
        shaderLibDataOfAllShaders
    )

    return {
        ...state,
        programMap,
        sendData
    }
}
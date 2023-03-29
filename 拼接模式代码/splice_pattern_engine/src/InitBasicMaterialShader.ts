import { getSendDataOfAllMaterialShaders, buildGLSL } from "glsl_handler"
import { state } from "./MainStateType"
import { material } from "./BasicMaterialStateType"
import { curry2, curry3_1, curry3_2 } from "fp/src/Curry"
import { buildGLSLChunkInVS, buildGLSLChunkInFS, generateAttributeType, generateUniformType, getShaderLibFromStaticBranch, isNameValidForStaticBranch, isPassForDynamicBranch } from "./BasicMaterialShaderGLSL"
import { addAttributeSendData } from "./BasicMaterialShaderAttributeSender"
import { addUniformSendData } from "./BasicMaterialShaderUniformSender"
import { Map } from "immutable"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { attributeType, uniformField, uniformFrom, uniformType } from "./GLSLConfigType"

let _createFakePrograms = (glslOfAllShaders) => {
    return glslOfAllShaders.reduce((programMap, [shaderName, [vsGLSL, fsGLSL]]) => {
        let fakeProgram = {} as any as WebGLProgram

        return programMap.set(shaderName, fakeProgram)
    }, Map())
}

export let initBasicMaterialShader = (state: state, material: material): state => {
    let [shaderLibDataOfAllShaders, glslOfAllShaders] = buildGLSL(
        [
            [[
                isNameValidForStaticBranch,
                curry3_1(getShaderLibFromStaticBranch)(state)
            ],
            curry3_2(isPassForDynamicBranch)(material, state)],
            [
                generateAttributeType,
                generateUniformType,
                curry2(buildGLSLChunkInVS)(state),
                curry2(buildGLSLChunkInFS)(state)
            ]
        ],
        state.shaders,
        state.shaderLibs,
        state.shaderChunk,
        state.precision
    )

    console.log(shaderLibDataOfAllShaders)
    console.log(glslOfAllShaders)

    let programMap = _createFakePrograms(glslOfAllShaders)

    let sendData = getSendDataOfAllMaterialShaders(
        [(sendDataArr, [name, buffer, type]) => {
            return addAttributeSendData(state.gl, getExnFromStrictNull(programMap.get(name)), sendDataArr, [name, buffer, type as attributeType])
        }, (sendDataArr, [name, field, type, from]) => {
            return addUniformSendData(state.gl, getExnFromStrictNull(programMap.get(name)), sendDataArr, [name, field as uniformField, type as uniformType, from as uniformFrom])
        }],
        shaderLibDataOfAllShaders
    )

    return {
        ...state,
        programMap,
        sendData
    }
}
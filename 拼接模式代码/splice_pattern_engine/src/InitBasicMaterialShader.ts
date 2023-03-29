import { getSendData, buildGLSL } from "glsl_handler"
import { state } from "./MainStateType"
import { material } from "./BasicMaterialStateType"
import { curry2, curry3_1, curry3_2 } from "fp/src/Curry"
import { buildGLSLChunkInVS, buildGLSLChunkInFS, generateAttributeType, generateUniformType, getShaderLibFromStaticBranch, isNameValidForStaticBranch, isPassForDynamicBranch } from "./BasicMaterialShaderGLSL"
import { addAttributeSendData } from "./BasicMaterialShaderAttributeSender"
import { addUniformSendData } from "./BasicMaterialShaderUniformSender"
import { Map } from "immutable"
import { getExnFromStrictUndefined } from "commonlib-ts/src/NullableUtils"
import { attributeType, uniformField, uniformFrom, uniformType } from "./GLSLConfigType"
import { shaderName } from "glsl_handler/src/type/GLSLConfigType.gen"
import { shaderIndex } from "./ShaderType"

type glslMap = Map<shaderIndex, glsl>

type glsl = [string, string]

let _generateShaderIndex = (glslMap: glslMap, glsl: glsl, maxShaderIndex: shaderIndex): [shaderIndex, shaderIndex] => {
    let result = glslMap.findEntry((value) => {
        return value[0] == glsl[0] && value[1] == glsl[1]
    })

    if (result === undefined) {
        return [maxShaderIndex, maxShaderIndex + 1]
    }

    return [getExnFromStrictUndefined(result[0]), maxShaderIndex]
}

let _createFakeProgram = ([vsGLSL, fsGLSL]) => {
    let fakeProgram = {} as any as WebGLProgram

    return fakeProgram
}

export let initBasicMaterialShader = (state: state, shaderName: shaderName, allMaterials: Array<material>): state => {
    let [programMap, sendDataMap, shaderIndexMap, _allGLSLs, maxShaderIndex] = allMaterials.reduce(([programMap, sendDataMap, shaderIndexMap, glslMap, maxShaderIndex]: any, material) => {
        let [shaderLibs, glsl] = buildGLSL(
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
            shaderName,
            state.shaderLibs,
            state.shaderChunk,
            state.precision
        )

        let [shaderIndex, newMaxShaderIndex] = _generateShaderIndex(glslMap, glsl, maxShaderIndex)

        let program = _createFakeProgram(glsl)

        let sendData = getSendData(
            [(sendDataArr, [name, buffer, type]) => {
                return addAttributeSendData(state.gl, program, sendDataArr, [name, buffer, type as attributeType])
            }, (sendDataArr, [name, field, type, from]) => {
                return addUniformSendData(state.gl, program, sendDataArr, [name, field as uniformField, type as uniformType, from as uniformFrom])
            }],
            shaderLibs
        )

        if (!glslMap.has(shaderIndex)) {
            glslMap = glslMap.set(shaderIndex, glsl)
        }

        console.log("glsl:", glsl)
        console.log("sendData:", sendData)
        console.log("shaderIndex:", shaderIndex)

        return [
            programMap.set(shaderIndex, program),
            sendDataMap.set(shaderIndex, sendData),
            shaderIndexMap.set(material, shaderIndex),
            glslMap,
            newMaxShaderIndex
        ]
    }, [state.programMap, state.sendDataMap, state.basicMaterialState.shaderIndexMap, Map(), state.maxShaderIndex])

    return {
        ...state,
        programMap, sendDataMap, maxShaderIndex,
        basicMaterialState: {
            ...state.basicMaterialState,
            shaderIndexMap: shaderIndexMap
        }
    }
}
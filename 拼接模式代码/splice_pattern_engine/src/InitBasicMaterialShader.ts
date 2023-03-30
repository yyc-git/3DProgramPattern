import { getSendData, buildGLSL } from "chunk_handler"
import { state } from "./MainStateType"
import { material } from "splice_pattern_utils/src/engine/BasicMaterialStateType"
import { curry2, curry3_1, curry3_2 } from "fp/src/Curry"
import { buildGLSLChunkInVS, buildGLSLChunkInFS, generateAttributeType, generateUniformType, getShaderLibFromStaticBranch, isNameValidForStaticBranch, isPassForDynamicBranch } from "./BasicMaterialShaderGLSL"
import { addAttributeSendData } from "./BasicMaterialShaderAttributeSender"
import { addUniformSendData } from "./BasicMaterialShaderUniformSender"
import { Map } from "immutable"
import { attributeType, uniformField, uniformFrom, uniformType } from "./GLSLConfigType"
import { shaderName } from "chunk_handler/src/type/GLSLConfigType.gen"
import { generateShaderIndex, createFakeProgram, setShaderIndex } from "splice_pattern_utils/src/engine/Shader"

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
            state.shaderLibs,
            state.chunk,
            shaderName,
            state.precision
        )

        let [shaderIndex, newMaxShaderIndex] = generateShaderIndex(glslMap, glsl, maxShaderIndex)

        let program = createFakeProgram(glsl)

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
            setShaderIndex(shaderIndexMap, material, shaderIndex),
            glslMap,
            newMaxShaderIndex
        ]
    }, [state.programMap, state.sendDataMap, state.shaderIndexMap, Map(), state.maxShaderIndex])

    return {
        ...state,
        programMap, sendDataMap, maxShaderIndex,
        shaderIndexMap
    }
}
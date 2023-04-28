import { getSendConfig, buildGLSL } from "chunk_handler"
import { state } from "./EngneStateType"
import { material } from "splice_pattern_utils/src/engine/MaterialType"
import { material as basicMaterial } from "splice_pattern_utils/src/engine/BasicMaterialStateType"
import { material as pbrMaterial } from "splice_pattern_utils/src/engine/PBRMaterialStateType"
import { curry2, curry3_1, curry3_2 } from "fp/src/Curry"
import * as BasicMaterialShaderGLSL from "./BasicMaterialShaderGLSL"
import * as BasicMaterialShaderAttributeSender from "./BasicMaterialShaderAttributeSender"
import * as BasicMaterialShaderUniformSender from "./BasicMaterialShaderUniformSender"
import * as PBRMaterialShaderGLSL from "./PBRMaterialShaderGLSL"
import * as PBRMaterialShaderAttributeSender from "./PBRMaterialShaderAttributeSender"
import * as PBRMaterialShaderUniformSender from "./PBRMaterialShaderUniformSender"
import { Map } from "immutable"
import { attributeType, uniformField, uniformFrom, uniformType } from "./GLSLConfigType"
import { shaderName } from "chunk_handler/src/type/GLSLConfigType.gen"
import { generateShaderIndex, createFakeProgram, setShaderIndex } from "splice_pattern_utils/src/engine/Shader"
import { getExnFromStrictUndefined } from "commonlib-ts/src/NullableUtils"
import { shaderIndex } from "splice_pattern_utils/src/engine/ShaderType"

let _initOneMaterialTypeShader = (
    state: state,
    [
        [[isNameValidForStaticBranch, getShaderChunkFromStaticBranch],
            isPassForDynamicBranch],
        [
            generateAttributeType,
            generateUniformType,
            buildGLSLChunkInVS,
            buildGLSLChunkInFS
        ],
        [
            addAttributeSendConfig,
            addUniformSendConfig
        ]
    ]: any,
    allMaterials: Array<material>,
    shaderName: shaderName,
    shaderIndexMap: Map<material, shaderIndex>
) => {
    let [newProgramMap, newSendConfigMap, newShaderIndexMap, _allGLSLs, newMaxShaderIndex] = allMaterials.reduce(([programMap, sendConfigMap, shaderIndexMap, glslMap, maxShaderIndex]: any, material) => {
        let [shaderChunks, glsl] = buildGLSL(
            [
                [[
                    isNameValidForStaticBranch,
                    curry3_1(getShaderChunkFromStaticBranch)(state) as any
                ],
                curry3_2(isPassForDynamicBranch)(material, state)] as any,
                [
                    generateAttributeType,
                    generateUniformType,
                    curry2(buildGLSLChunkInVS)(state) as any,
                    curry2(buildGLSLChunkInFS)(state) as any
                ]
            ],
            state.shaders,
            state.shaderChunks,
            state.chunk,
            shaderName,
            state.precision
        )

        let [shaderIndex, newMaxShaderIndex] = generateShaderIndex(glslMap, glsl, maxShaderIndex)

        if (!programMap.has(shaderIndex)) {
            programMap = programMap.set(shaderIndex, createFakeProgram(glsl))
        }

        let program = getExnFromStrictUndefined(programMap.get(shaderIndex))

        let sendConfig = getSendConfig(
            [(sendConfigArr, [name, buffer, type]) => {
                return addAttributeSendConfig(state.gl, program, sendConfigArr, [name, buffer, type as attributeType])
            }, (sendConfigArr, [name, field, type, from]) => {
                return addUniformSendConfig(state.gl, program, sendConfigArr, [name, field as uniformField, type as uniformType, from as uniformFrom])
            }],
            shaderChunks
        )

        if (!glslMap.has(shaderIndex)) {
            glslMap = glslMap.set(shaderIndex, glsl)
        }

        console.log(glsl)
        console.log("shaderIndex:", shaderIndex)

        return [
            programMap,
            sendConfigMap.set(shaderIndex, sendConfig),
            setShaderIndex(shaderIndexMap, material, shaderIndex),
            glslMap,
            newMaxShaderIndex
        ]
    }, [state.programMap, state.sendConfigMap, shaderIndexMap, Map(), state.maxShaderIndex])

    return [newProgramMap, newSendConfigMap, newShaderIndexMap, newMaxShaderIndex]
}

export let initBasicMaterialShader = (
    state: state,
    [allMaterials, shaderName]: [
        Array<basicMaterial>,
        shaderName
    ]
): state => {
    let [newProgramMap, newSendConfigMap, newShaderIndexMap, newMaxShaderIndex] = _initOneMaterialTypeShader(state,
        [
            [[
                BasicMaterialShaderGLSL.isNameValidForStaticBranch,
                BasicMaterialShaderGLSL.getShaderChunkFromStaticBranch
            ],
            BasicMaterialShaderGLSL.isPassForDynamicBranch],
            [
                BasicMaterialShaderGLSL.generateAttributeType,
                BasicMaterialShaderGLSL.generateUniformType,
                BasicMaterialShaderGLSL.buildGLSLChunkInVS,
                BasicMaterialShaderGLSL.buildGLSLChunkInFS
            ],
            [
                BasicMaterialShaderAttributeSender.addAttributeSendConfig,
                BasicMaterialShaderUniformSender.addUniformSendConfig
            ]
        ],
        allMaterials, shaderName, state.basicMaterialShaderIndexMap)

    return {
        ...state,
        programMap: newProgramMap,
        sendConfigMap: newSendConfigMap,
        basicMaterialShaderIndexMap: newShaderIndexMap,
        maxShaderIndex: newMaxShaderIndex
    }
}

export let initPBRMaterialShader = (
    state: state,
    [allMaterials, shaderName]: [
        Array<pbrMaterial>,
        shaderName
    ]
): state => {
    let [newProgramMap, newSendConfigMap, newShaderIndexMap, newMaxShaderIndex] = _initOneMaterialTypeShader(state,
        [
            [[
                PBRMaterialShaderGLSL.isNameValidForStaticBranch,
                PBRMaterialShaderGLSL.getShaderChunkFromStaticBranch
            ],
            PBRMaterialShaderGLSL.isPassForDynamicBranch],
            [
                PBRMaterialShaderGLSL.generateAttributeType,
                PBRMaterialShaderGLSL.generateUniformType,
                PBRMaterialShaderGLSL.buildGLSLChunkInVS,
                PBRMaterialShaderGLSL.buildGLSLChunkInFS
            ],
            [
                PBRMaterialShaderAttributeSender.addAttributeSendConfig,
                PBRMaterialShaderUniformSender.addUniformSendConfig
            ]
        ],
        allMaterials, shaderName, state.pbrMaterialShaderIndexMap)

    return {
        ...state,
        programMap: newProgramMap,
        sendConfigMap: newSendConfigMap,
        pbrMaterialShaderIndexMap: newShaderIndexMap,
        maxShaderIndex: newMaxShaderIndex
    }
}
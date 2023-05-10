import * as ChunkHandler from "chunk_handler"
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
import * as ShaderUtils from "splice_pattern_utils/src/engine/Shader"
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
            addAttributeSendMetadata,
            addUniformSendMetadata
        ]
    ]: any,
    allMaterials: Array<material>,
    shaderName: shaderName,
    shaderIndexMap: Map<material, shaderIndex>
) => {
    let [newProgramMap, newSendMetadataMap, newShaderIndexMap, _allGLSLs, newMaxShaderIndex] = allMaterials.reduce(([programMap, sendMetadataMap, shaderIndexMap, glslMap, maxShaderIndex]: any, material) => {
        //返回的glsl是拼接后的一个Target GLSL
        //返回的shaderChunks是处理shaders.json的shaders字段中shaderName种类的shader_chunks字段后的配置数据
        let [shaderChunks, glsl] = ChunkHandler.buildGLSL(
            [
                [[
                    isNameValidForStaticBranch,
                    //柯西化，传入部分参数：state
                    curry3_1(getShaderChunkFromStaticBranch)(state) as any
                ],
                //柯西化，传入部分参数：material, state
                curry3_2(isPassForDynamicBranch)(material, state)] as any,
                [
                    generateAttributeType,
                    generateUniformType,
                    //柯西化，传入部分参数：state
                    curry2(buildGLSLChunkInVS)(state) as any,
                    //柯西化，传入部分参数：state
                    curry2(buildGLSLChunkInFS)(state) as any
                ]
            ],
            state.shaders,
            state.shaderChunks,
            state.chunk,
            shaderName,
            state.precision
        )

        let [shaderIndex, newMaxShaderIndex] = ShaderUtils.generateShaderIndex(glslMap, glsl, maxShaderIndex)

        if (!programMap.has(shaderIndex)) {
            programMap = programMap.set(shaderIndex, ShaderUtils.createFakeProgram(glsl))
        }

        let program = getExnFromStrictUndefined(programMap.get(shaderIndex))

        let sendMetadata = ChunkHandler.buildSendMetadata(
            [(sendMetadataArr, [name, buffer, type]) => {
                return addAttributeSendMetadata(state.gl, program, sendMetadataArr, [name, buffer, type as attributeType])
            }, (sendMetadataArr, [name, field, type, from]) => {
                return addUniformSendMetadata(state.gl, program, sendMetadataArr, [name, field as uniformField, type as uniformType, from as uniformFrom])
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
            sendMetadataMap.set(shaderIndex, sendMetadata),
            ShaderUtils.setShaderIndex(shaderIndexMap, material, shaderIndex),
            glslMap,
            newMaxShaderIndex
        ]
    }, [state.programMap, state.sendMetadataMap, shaderIndexMap, Map(), state.maxShaderIndex])

    return [newProgramMap, newSendMetadataMap, newShaderIndexMap, newMaxShaderIndex]
}

export let initBasicMaterialShader = (
    state: state,
    [allMaterials, shaderName]: [
        Array<basicMaterial>,
        shaderName
    ]
): state => {
    let [newProgramMap, newSendMetadataMap, newShaderIndexMap, newMaxShaderIndex] = _initOneMaterialTypeShader(state,
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
                BasicMaterialShaderAttributeSender.addAttributeSendMetadata,
                BasicMaterialShaderUniformSender.addUniformSendMetadata
            ]
        ],
        allMaterials, shaderName, state.basicMaterialShaderIndexMap)

    return {
        ...state,
        programMap: newProgramMap,
        sendMetadataMap: newSendMetadataMap,
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
    let [newProgramMap, newSendMetadataMap, newShaderIndexMap, newMaxShaderIndex] = _initOneMaterialTypeShader(state,
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
                PBRMaterialShaderAttributeSender.addAttributeSendMetadata,
                PBRMaterialShaderUniformSender.addUniformSendMetadata
            ]
        ],
        allMaterials, shaderName, state.pbrMaterialShaderIndexMap)

    return {
        ...state,
        programMap: newProgramMap,
        sendMetadataMap: newSendMetadataMap,
        pbrMaterialShaderIndexMap: newShaderIndexMap,
        maxShaderIndex: newMaxShaderIndex
    }
}
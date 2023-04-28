import { state as gameObjectState } from "splice_pattern_utils/src/engine/GameObjectStateType"
import { glslName, shaderChunks, shaders } from "chunk_handler/src/type/GLSLConfigType.gen"
import { state as transformState } from "splice_pattern_utils/src/engine/TransformStateType"
import type { Map } from "immutable"
import { sendConfig as sendConfigGLSLHandler } from "chunk_handler/src/Main"
import { sendConfig as attributeSendConfig } from "./MaterialShaderAttributeSenderUtils"
import { sendConfig as uniformSendConfig } from "./MaterialShaderUniformSenderType"
import { glslChunk } from "chunk_converter/src/ChunkType.gen"
import { shaderIndex } from "splice_pattern_utils/src/engine/ShaderType"
import * as BasicMaterialStateType from "splice_pattern_utils/src/engine/BasicMaterialStateType"
import * as PBRMaterialStateType from "splice_pattern_utils/src/engine/PBRMaterialStateType"

export type sendConfig = sendConfigGLSLHandler<attributeSendConfig, uniformSendConfig>

export type programMap = Map<shaderIndex, WebGLProgram>

export type sendConfigMap = Map<shaderIndex, sendConfig>

export type state = {
    gl: WebGLRenderingContext,
    programMap: programMap,
    sendConfigMap: sendConfigMap,
    maxShaderIndex: number,
    basicMaterialShaderIndexMap: Map<BasicMaterialStateType.material, shaderIndex>,
    pbrMaterialShaderIndexMap: Map<PBRMaterialStateType.material, shaderIndex>,
    vMatrix: Float32Array | null,
    pMatrix: Float32Array | null,
    shaders: shaders,
    shaderChunks: shaderChunks,
    isSupportInstance: boolean,
    maxDirectionLightCount: number,
    chunk: Record<glslName, glslChunk>,
    precision: "highp" | "mediump" | "lowp",

    gameObjectState: gameObjectState,
    basicMaterialState: BasicMaterialStateType.state,
    pbrMaterialState: PBRMaterialStateType.state,
    transformState: transformState
}
import { state as gameObjectState } from "splice_pattern_utils/src/engine/GameObjectStateType"
import { glslName, shaderChunks, shaders } from "chunk_handler/src/type/GLSLConfigType.gen"
import { state as transformState } from "splice_pattern_utils/src/engine/TransformStateType"
import type { Map } from "immutable"
import { sendMetadata as sendMetadataGLSLHandler } from "chunk_handler/src/Main"
import { sendMetadata as attributeSendMetadata } from "./MaterialShaderAttributeSenderUtils"
import { sendMetadata as uniformSendMetadata } from "./MaterialShaderUniformSenderType"
import { glslChunk } from "chunk_converter/src/ChunkType.gen"
import { shaderIndex } from "splice_pattern_utils/src/engine/ShaderType"
import * as BasicMaterialStateType from "splice_pattern_utils/src/engine/BasicMaterialStateType"
import * as PBRMaterialStateType from "splice_pattern_utils/src/engine/PBRMaterialStateType"

export type sendMetadata = sendMetadataGLSLHandler<attributeSendMetadata, uniformSendMetadata>

export type programMap = Map<shaderIndex, WebGLProgram>

export type sendMetadataMap = Map<shaderIndex, sendMetadata>

export type state = {
    gl: WebGLRenderingContext,
    programMap: programMap,
    sendMetadataMap: sendMetadataMap,
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
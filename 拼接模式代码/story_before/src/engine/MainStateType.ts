import { state as basicMaterialState } from "splice_pattern_utils/src/engine/BasicMaterialStateType"
import { state as transformState } from "splice_pattern_utils/src/engine/TransformStateType"
import type { Map } from "immutable"
import { shaderIndex } from "splice_pattern_utils/src/engine/ShaderType"

export type programMap = Map<shaderIndex, WebGLProgram>

type material = number

export type state = {
    gl: WebGLRenderingContext,
    programMap: programMap,
    maxShaderIndex: number,
    shaderIndexMap: Map<material, shaderIndex>,
    vMatrix: Float32Array | null,
    pMatrix: Float32Array | null,
    isSupportHardwareInstance: boolean,
    isSupportBatchInstance: boolean,
    maxDirectionLightCount: number,

    basicMaterialState: basicMaterialState
    transformState: transformState
}
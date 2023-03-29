import { state as basicMaterialState } from "./BasicMaterialStateType"
import { state as transformState } from "./TransformStateType"
import type { Map } from "immutable"
import { shaderIndex } from "./ShaderType"

export type programMap = Map<shaderIndex, WebGLProgram>

export type state = {
    gl: WebGLRenderingContext,
    programMap: programMap,
    maxShaderIndex: number,
    vMatrix: Float32Array | null,
    pMatrix: Float32Array | null,
    isSupportHardwareInstance: boolean,
    isSupportBatchInstance: boolean,
    maxDirectionLightCount: number,

    basicMaterialState: basicMaterialState
    transformState: transformState
}
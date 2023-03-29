import { glslName, shaderLibs, shaders } from "glsl_handler/src/type/GLSLConfigType.gen"
import { state as basicMaterialState } from "./BasicMaterialStateType"
import { state as transformState } from "./TransformStateType"
import type { Map } from "immutable"
import { sendData as sendDataGLSLHandler } from "glsl_handler/src/Main"
import { sendData as attributeSendData } from "./BasicMaterialShaderAttributeSender"
import { sendData as uniformSendData } from "./BasicMaterialShaderUniformSender"
import { glslChunk } from "glsl_converter/src/ShaderChunkType.gen"
import { shaderIndex } from "./ShaderType"

export type sendData = sendDataGLSLHandler<attributeSendData, uniformSendData>

export type programMap = Map<shaderIndex, WebGLProgram>

export type sendDataMap = Map<shaderIndex, sendData>

export type state = {
    gl: WebGLRenderingContext,
    programMap: programMap,
    sendDataMap: sendDataMap,
    maxShaderIndex:number,
    vMatrix: Float32Array | null,
    pMatrix: Float32Array | null,
    shaders: shaders,
    shaderLibs: shaderLibs,
    isSupportHardwareInstance: boolean,
    isSupportBatchInstance: boolean,
    maxDirectionLightCount: number,
    shaderChunk: Record<glslName, glslChunk>,
    precision: "highp" | "mediump" | "lowp",

    basicMaterialState: basicMaterialState
    transformState: transformState
}
import { glslName, shaderLibs, shaders } from "glsl_handler/src/type/GLSLConfigType.gen"
import { state as basicMaterialState } from "./BasicMaterialStateType"
import { state as transformState } from "./TransformStateType"
import type { Map } from "immutable"
import { sendDataOfAllMaterialShaders } from "../../glsl_handler/src/Main"
import { sendData as attributeSendData } from "./BasicMaterialShaderAttributeSender"
import { sendData as uniformSendData } from "./BasicMaterialShaderUniformSender"
import { glslChunk } from "glsl_converter/src/ShaderChunkType.gen"

type shaderName = string

export type sendData = sendDataOfAllMaterialShaders<attributeSendData, uniformSendData>

export type state = {
    gl: WebGLRenderingContext,
    programMap: Map<shaderName, WebGLProgram> | null,
    sendData: sendData | null,
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
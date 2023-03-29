import { glslName, shaderLibs, shaders } from "glsl_handler_abstract/src/type/GLSLConfigType.gen"
import type { Map } from "immutable"
import { sendData as sendDataGLSLHandler } from "glsl_handler_abstract/src/Main"
import { sendData as attributeSendData } from "./XxxMaterialShaderAttributeSender"
import { sendData as uniformSendData } from "./XxxMaterialShaderUniformSender"
import { glslChunk } from "glsl_converter_abstract/src/ShaderChunkType.gen"
import { shaderIndex } from "./ShaderType"

export type sendData = sendDataGLSLHandler<attributeSendData, uniformSendData>

export type programMap = Map<shaderIndex, WebGLProgram>

export type sendDataMap = Map<shaderIndex, sendData>

type material = any

export type state = {
    gl: WebGLRenderingContext,
    programMap: programMap,
    sendDataMap: sendDataMap,
    shaderIndexMap: Map<material, shaderIndex>,
    maxShaderIndex: number,
    shaders: shaders,
    shaderLibs: shaderLibs,
    shaderChunk: Record<glslName, glslChunk>,
    precision: "highp" | "mediump" | "lowp",

    更多字段...
}
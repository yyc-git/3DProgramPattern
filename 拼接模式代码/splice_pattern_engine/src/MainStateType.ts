import { shaderLibs, shaders } from "glsl_handler/src/type/GLSLConfigType"
import { state as basicMaterialState } from "./BasicMaterialStateType"
import { state as transformState } from "./TransformStateType"
import type { Map } from "immutable"
import { sendDataOfAllMaterialShaders } from "../../glsl_handler/src/Main"
import { sendData as attributeSendData } from "./BasicMaterialShaderAttributeSender"
import { sendData as uniformSendData } from "./BasicMaterialShaderUniformSender"

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
    basicMaterialState: basicMaterialState
    transformState: transformState
}
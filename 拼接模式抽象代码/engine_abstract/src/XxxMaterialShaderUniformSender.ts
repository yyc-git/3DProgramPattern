import { state } from "./MainStateType"
import { uniformField, uniformType, uniformFrom } from "./GLSLConfigType";
import { uniformName } from "glsl_handler_abstract/src/type/GLSLConfigType.gen";

type transform = any

type getXxxMaterialDataFunc = (state: state, material: any) => any

type getCameraDataFunc = (state: state) => any

type getModelDataFunc = (state: state, transform: transform) => Float32Array

type sendDataFunc = (gl: WebGLRenderingContext, pos: WebGLUniformLocation, data: any) => void

type singleSendData<getDataFunc> = {
    pos: WebGLUniformLocation,
    getData: getDataFunc,
    sendData: sendDataFunc,
}

export type sendData = {
    shaderSendData?: singleSendData<getCameraDataFunc>,
    renderObjectSendModelData?: singleSendData<getModelDataFunc>,
    renderObjectSendXxxMaterialData?: singleSendData<getXxxMaterialDataFunc>,

    更多的SendData...
}

export declare function addUniformSendData(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    sendDataArr: Array<sendData>, [name, field, type, from]: [uniformName, uniformField, uniformType, uniformFrom]
): Array<sendData>
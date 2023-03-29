import { attributeName } from "glsl_handler_abstract/src/type/GLSLConfigType.gen";
import { attributeType, attributeBuffer } from "./GLSLConfigType";

type attributeLocation = GLint

export type sendData = {
    elementSendData?: {
        sendBuffer: (gl: WebGLRenderingContext, buffer: WebGLBuffer) => void
    },
    instanceSendData?: {
        pos: attributeLocation,
        size: number,
        getOffset: (index: number) => number
    },
    otherSendData?: {
        pos: attributeLocation,
        size: number,
        buffer: attributeBuffer,
        sendBuffer: (gl: WebGLRenderingContext, size: number, pos: attributeLocation, buffer: WebGLBuffer) => void
    },

    更多的SendData...
}

export declare function addAttributeSendData(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    sendDataArr: Array<sendData>, [name, buffer, type]: [attributeName, attributeBuffer, attributeType]
): Array<sendData>
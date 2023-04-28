import { attributeName } from "chunk_handler/src/type/GLSLConfigType.gen";
import { attributeType, attributeBuffer } from "./GLSLConfigType";

type attributeLocation = GLint

export type sendConfig = {
    elementSendConfig?: {
        sendBuffer: (gl: WebGLRenderingContext, buffer: WebGLBuffer) => void
    },
    instanceSendConfig?: {
        pos: attributeLocation,
        size: number,
        getOffset: (index: number) => number
    },
    otherSendConfig?: {
        pos: attributeLocation,
        size: number,
        buffer: attributeBuffer,
        sendBuffer: (gl: WebGLRenderingContext, size: number, pos: attributeLocation, buffer: WebGLBuffer) => void
    }
}

let _addModelMatrixInstanceArrayBufferSendConfig = (sendConfigArr: Array<sendConfig>, pos: attributeLocation
) => {
    sendConfigArr.push({
        instanceSendConfig: {
            pos: pos,
            size: 4,
            getOffset: (index) => index * 16,
        }
    })

    return sendConfigArr
}

let _getBufferSizeByType = (type: attributeType) => {
    switch (type) {
        case "vec2":
            return 2
        case "vec3":
            return 3
        default:
            throw new Error()
    }
}

let _addElementBufferSendConfig = (sendConfigArr: Array<sendConfig>
) => {
    sendConfigArr.push({
        elementSendConfig: {
            sendBuffer: (gl: WebGLRenderingContext, buffer: WebGLBuffer) => {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
            }
        }
    })

    return sendConfigArr
}

let _addOtherSendConfig = (sendConfigArr: Array<sendConfig>, [pos, buffer, type]: [attributeLocation, attributeBuffer, attributeType]
) => {
    sendConfigArr.push({
        otherSendConfig: {
            pos: pos,
            size: _getBufferSizeByType(type),
            buffer: buffer,
            sendBuffer: (gl: WebGLRenderingContext, size: number, pos: attributeLocation, buffer: WebGLBuffer) => {
                if (pos !== -1) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
                    gl.vertexAttribPointer(pos, size, gl.FLOAT, false, 0, 0)
                    gl.enableVertexAttribArray(pos)
                }
            }
        }
    })

    return sendConfigArr
}

export let addAttributeSendConfig = (
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    sendConfigArr: Array<sendConfig>, [name, buffer, type]: [attributeName, attributeBuffer, attributeType]
): Array<sendConfig> => {
    let pos = gl.getAttribLocation(program, name)

    switch (buffer) {
        case attributeBuffer.Instance_model_matrix:
            _addModelMatrixInstanceArrayBufferSendConfig(sendConfigArr, pos)
            break
        case attributeBuffer.Index:
            _addElementBufferSendConfig(sendConfigArr)
            break
        default:
            _addOtherSendConfig(sendConfigArr, [pos, buffer, type])
            break
    }

    return sendConfigArr
}
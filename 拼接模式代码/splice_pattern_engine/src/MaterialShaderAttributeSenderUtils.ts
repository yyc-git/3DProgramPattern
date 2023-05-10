import { attributeName } from "chunk_handler/src/type/GLSLConfigType.gen";
import { attributeType, attributeBuffer } from "./GLSLConfigType";

type attributeLocation = GLint

export type sendMetadata = {
    elementSendMetadata?: {
        sendBuffer: (gl: WebGLRenderingContext, buffer: WebGLBuffer) => void
    },
    instanceSendMetadata?: {
        pos: attributeLocation,
        size: number,
        getOffset: (index: number) => number
    },
    otherSendMetadata?: {
        pos: attributeLocation,
        size: number,
        buffer: attributeBuffer,
        sendBuffer: (gl: WebGLRenderingContext, size: number, pos: attributeLocation, buffer: WebGLBuffer) => void
    }
}

let _addModelMatrixInstanceArrayBufferSendMetadata = (sendMetadataArr: Array<sendMetadata>, pos: attributeLocation
) => {
    sendMetadataArr.push({
        instanceSendMetadata: {
            pos: pos,
            size: 4,
            getOffset: (index) => index * 16,
        }
    })

    return sendMetadataArr
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

let _addElementBufferSendMetadata = (sendMetadataArr: Array<sendMetadata>
) => {
    sendMetadataArr.push({
        elementSendMetadata: {
            sendBuffer: (gl: WebGLRenderingContext, buffer: WebGLBuffer) => {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
            }
        }
    })

    return sendMetadataArr
}

let _addOtherSendMetadata = (sendMetadataArr: Array<sendMetadata>, [pos, buffer, type]: [attributeLocation, attributeBuffer, attributeType]
) => {
    sendMetadataArr.push({
        otherSendMetadata: {
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

    return sendMetadataArr
}

export let addAttributeSendMetadata = (
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    sendMetadataArr: Array<sendMetadata>, [name, buffer, type]: [attributeName, attributeBuffer, attributeType]
): Array<sendMetadata> => {
    let pos = gl.getAttribLocation(program, name)

    switch (buffer) {
        case attributeBuffer.Instance_model_matrix:
            _addModelMatrixInstanceArrayBufferSendMetadata(sendMetadataArr, pos)
            break
        case attributeBuffer.Index:
            _addElementBufferSendMetadata(sendMetadataArr)
            break
        default:
            _addOtherSendMetadata(sendMetadataArr, [pos, buffer, type])
            break
    }

    return sendMetadataArr
}
import { attributeName, attributeType, bufferEnum } from "glsl_handler/src/type/GLSLConfigType";

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
        buffer: bufferEnum,
        sendBuffer: (gl: WebGLRenderingContext, size: number, pos: attributeLocation, buffer: WebGLBuffer) => void
    }
}

let _addModelMatrixInstanceArrayBufferSendData = (sendDataArr: Array<sendData>, pos: attributeLocation
) => {
    sendDataArr.push({
        instanceSendData: {
            pos: pos,
            size: 4,
            getOffset: (index) => index * 16,
        }
    })

    return sendDataArr
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

let _addElementBufferSendData = (sendDataArr: Array<sendData>
) => {
    sendDataArr.push({
        elementSendData: {
            sendBuffer: (gl: WebGLRenderingContext, buffer: WebGLBuffer) => {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
            }
        }
    })

    return sendDataArr
}

let _addOtherSendData = (sendDataArr: Array<sendData>, [pos, buffer, type]: [attributeLocation, bufferEnum, attributeType]
) => {
    sendDataArr.push({
        otherSendData: {
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

    return sendDataArr
}

export let addAttributeSendData = (
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    sendDataArr: Array<sendData>, [name, buffer, type]: [attributeName, bufferEnum, attributeType]
): Array<sendData> => {
    let pos = gl.getAttribLocation(program, name)

    switch (buffer) {
        case bufferEnum.Instance_model_matrix:
            _addModelMatrixInstanceArrayBufferSendData(sendDataArr, pos)
            break
        case bufferEnum.Index:
            _addElementBufferSendData(sendDataArr)
            break
        default:
            _addOtherSendData(sendDataArr, [pos, buffer, type])
            break
    }

    return sendDataArr
}
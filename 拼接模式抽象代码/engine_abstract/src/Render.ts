import { state } from "./MainStateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { sendData as attributeSendData } from "./XxxMaterialShaderAttributeSender"
import { sendData as uniformSendData } from "./XxxMaterialShaderUniformSender"
import { attributeBuffer } from "./GLSLConfigType"
import { getShaderIndex } from "./Shader"
import { shaderIndex } from "./ShaderType"

declare function _getArrayBuffer(state: state, attributeBuffer: attributeBuffer, shaderIndex: shaderIndex): WebGLBuffer

declare function _getElementArrayBuffer(state: state, shaderIndex: shaderIndex): WebGLBuffer

let _sendAttributeData = (attributeSendData: Array<attributeSendData>, state: state, shaderIndex: shaderIndex, gl: WebGLRenderingContext) => {
    attributeSendData.forEach(data => {
        if (!!data.elementSendData) {
            data.elementSendData.sendBuffer(gl, _getElementArrayBuffer(state, shaderIndex))
        }
        if (!!data.instanceSendData) {
            console.log("发送instance相关的顶点数据...")
        }
        if (!!data.otherSendData) {
            let { pos, size, sendBuffer, buffer } = data.otherSendData

            sendBuffer(gl, size, pos, _getArrayBuffer(state, buffer, shaderIndex))
        }
        if (!!data.更多的SendData) {
            console.log("发送更多的Data")
        }
    })
}

let _sendUniformData = (uniformSendData: Array<uniformSendData>, state: state, transform, material, gl: WebGLRenderingContext) => {
    uniformSendData.forEach(data => {
        if (!!data.shaderSendData) {
            let { pos, getData, sendData } = data.shaderSendData

            sendData(gl, pos, getData(state))
        }
        if (!!data.renderObjectSendXxxMaterialData) {
            let { pos, getData, sendData } = data.renderObjectSendXxxMaterialData

            sendData(gl, pos, getData(state, material))
        }
        if (!!data.renderObjectSendModelData) {
            let { pos, getData, sendData } = data.renderObjectSendModelData

            sendData(gl, pos, getData(state, transform))
        }
        if (!!data.更多的SendData) {
            console.log("发送更多的Data")
        }
    })
}

type gameObject = any
type material = any
type transform = any

declare function _getAllGameObjects(): Array<gameObject>

declare function _getMaterial(state: state, gameObject: gameObject): material

declare function _getTransform(state: state, gameObject: gameObject): transform

export let render = (state: state): state => {
    let gl = state.gl
    let sendDataMap = state.sendDataMap
    let programMap = state.programMap

    _getAllGameObjects().forEach(gameObject => {
        let material = _getMaterial(state, gameObject)
        let transform = _getTransform(state, gameObject)

        let shaderIndex = getShaderIndex(state.shaderIndexMap, material)

        let program = getExnFromStrictNull(programMap.get(shaderIndex))
        let sendData = getExnFromStrictNull(sendDataMap.get(shaderIndex))


        gl.useProgram(program)

        let [attributeSendData, uniformSendData] = sendData

        _sendAttributeData(attributeSendData, state, shaderIndex, gl)
        _sendUniformData(uniformSendData, state, transform, material, gl)

        console.log("其它渲染逻辑...")
    })

    return state
}
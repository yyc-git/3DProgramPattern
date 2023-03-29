import { state } from "./MainStateType"
import { transform } from "splice_pattern_utils/src/engine/TransformStateType"
import { material } from "splice_pattern_utils/src/engine/BasicMaterialStateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { sendData as attributeSendData } from "./BasicMaterialShaderAttributeSender"
import { sendData as uniformSendData } from "./BasicMaterialShaderUniformSender"
import { attributeBuffer } from "./GLSLConfigType"
import { getShaderIndex } from "splice_pattern_utils/src/engine/BasicMaterial"
import { shaderIndex } from "splice_pattern_utils/src/engine/ShaderType"

let _getFakeArrayBuffer = (state, attributeBuffer: attributeBuffer, shaderIndex) => {
    return {} as WebGLBuffer
}

let _getFakeElementArrayBuffer = (state, shaderIndex) => {
    return {} as WebGLBuffer
}

let _sendAttributeData = (attributeSendData: Array<attributeSendData>, state: state, shaderIndex: shaderIndex, gl: WebGLRenderingContext) => {
    attributeSendData.forEach(data => {
        if (!!data.elementSendData) {
            data.elementSendData.sendBuffer(gl, _getFakeElementArrayBuffer(state, shaderIndex))
        }
        if (!!data.instanceSendData) {
            console.log("发送instance相关的顶点数据...")
        }
        if (!!data.otherSendData) {
            let { pos, size, sendBuffer, buffer } = data.otherSendData

            sendBuffer(gl, size, pos, _getFakeArrayBuffer(state, buffer, shaderIndex))
        }
    })
}

let _sendUniformData = (uniformSendData: Array<uniformSendData>, state: state, transform, material, gl: WebGLRenderingContext) => {
    uniformSendData.forEach(data => {
        if (!!data.shaderSendData) {
            let { pos, getData, sendData } = data.shaderSendData

            sendData(gl, pos, getData(state))
        }
        if (!!data.renderObjectSendModelData) {
            let { pos, getData, sendData } = data.renderObjectSendModelData

            sendData(gl, pos, getData(state, transform))
        }
        if (!!data.renderObjectSendModelData) {
            let { pos, getData, sendData } = data.renderObjectSendMaterialData

            sendData(gl, pos, getData(state, material))
        }
    })
}

let _getAllFakeGameObjects = () => {
    return [0] as any
}

let _getFakeMaterial = (state, gameObject) => {
    return 0 as any as material
}

let _getFakeTransform = (state, gameObject) => {
    return 0 as any as transform
}

export let render = (state: state): state => {
    let gl = state.gl
    let sendDataMap = state.sendDataMap
    let programMap = state.programMap

    _getAllFakeGameObjects().forEach(gameObject => {
        let material = _getFakeMaterial(state, gameObject)
        let transform = _getFakeTransform(state, gameObject)

        let shaderIndex = getShaderIndex(state.basicMaterialState, material)

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
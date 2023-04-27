import { state } from "./EngneStateType"
import { getExnFromStrictUndefined } from "commonlib-ts/src/NullableUtils"
import { sendData as attributeSendData } from "./MaterialShaderAttributeSenderUtils"
import { sendData as uniformSendData } from "./MaterialShaderUniformSenderType"
import { attributeBuffer } from "./GLSLConfigType"
import { getShaderIndex } from "splice_pattern_utils/src/engine/Shader"
import { shaderIndex } from "splice_pattern_utils/src/engine/ShaderType"
import { getAllGameObjects, getMaterial, getTransform } from "splice_pattern_utils/src/engine/GameObject"
import { materialType } from "splice_pattern_utils/src/engine/MaterialType"

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
        if (!!data.renderObjectSendMaterialData) {
            let { pos, getData, sendData } = data.renderObjectSendMaterialData

            sendData(gl, pos, getData(state, material))
        }
        if (!!data.renderObjectSendModelData) {
            let { pos, getData, sendData } = data.renderObjectSendModelData

            sendData(gl, pos, getData(state, transform))
        }
    })
}

export let render = (state: state): state => {
    let gl = state.gl
    let sendDataMap = state.sendDataMap
    let programMap = state.programMap

    getAllGameObjects(state.gameObjectState).forEach(gameObject => {
        let [material, materialType_] = getMaterial(state.gameObjectState, gameObject)
        let transform = getTransform(state.gameObjectState, gameObject)

        let shaderIndex = null
        switch (materialType_) {
            case materialType.Basic:
                shaderIndex = getShaderIndex(state.basicMaterialShaderIndexMap, material)
                break
            case materialType.PBR:
                shaderIndex = getShaderIndex(state.pbrMaterialShaderIndexMap, material)
                break
        }

        let program = getExnFromStrictUndefined(programMap.get(shaderIndex))
        let sendData = getExnFromStrictUndefined(sendDataMap.get(shaderIndex))

        gl.useProgram(program)

        let [attributeSendData, uniformSendData] = sendData

        _sendAttributeData(attributeSendData, state, shaderIndex, gl)
        _sendUniformData(uniformSendData, state, transform, material, gl)

        console.log("其它渲染逻辑...")
    })

    return state
}
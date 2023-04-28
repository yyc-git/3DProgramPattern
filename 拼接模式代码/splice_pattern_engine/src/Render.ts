import { state } from "./EngneStateType"
import { getExnFromStrictUndefined } from "commonlib-ts/src/NullableUtils"
import { sendConfig as attributeSendConfig } from "./MaterialShaderAttributeSenderUtils"
import { sendConfig as uniformSendConfig } from "./MaterialShaderUniformSenderType"
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

let _sendAttributeData = (attributeSendConfig: Array<attributeSendConfig>, state: state, shaderIndex: shaderIndex, gl: WebGLRenderingContext) => {
    attributeSendConfig.forEach(data => {
        if (!!data.elementSendConfig) {
            data.elementSendConfig.sendBuffer(gl, _getFakeElementArrayBuffer(state, shaderIndex))
        }
        if (!!data.instanceSendConfig) {
            console.log("发送instance相关的顶点数据...")
        }
        if (!!data.otherSendConfig) {
            let { pos, size, sendBuffer, buffer } = data.otherSendConfig

            sendBuffer(gl, size, pos, _getFakeArrayBuffer(state, buffer, shaderIndex))
        }
    })
}

let _sendUniformData = (uniformSendConfig: Array<uniformSendConfig>, state: state, transform, material, gl: WebGLRenderingContext) => {
    uniformSendConfig.forEach(data => {
        if (!!data.shaderSendConfig) {
            let { pos, getData, sendData } = data.shaderSendConfig

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
    let sendConfigMap = state.sendConfigMap
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
        let sendConfig = getExnFromStrictUndefined(sendConfigMap.get(shaderIndex))

        gl.useProgram(program)

        let [attributeSendConfig, uniformSendConfig] = sendConfig

        _sendAttributeData(attributeSendConfig, state, shaderIndex, gl)
        _sendUniformData(uniformSendConfig, state, transform, material, gl)

        console.log("其它渲染逻辑...")
    })

    return state
}
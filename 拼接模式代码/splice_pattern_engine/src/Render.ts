import { state } from "./EngneStateType"
import { getExnFromStrictUndefined } from "commonlib-ts/src/NullableUtils"
import { sendMetadata as attributeSendMetadata } from "./MaterialShaderAttributeSenderUtils"
import { sendMetadata as uniformSendMetadata } from "./MaterialShaderUniformSenderType"
import { attributeBuffer } from "./GLSLConfigType"
import * as ShaderUtils from "splice_pattern_utils/src/engine/Shader"
import { shaderIndex } from "splice_pattern_utils/src/engine/ShaderType"
import { getAllGameObjects, getMaterial, getTransform } from "splice_pattern_utils/src/engine/GameObject"
import { materialType } from "splice_pattern_utils/src/engine/MaterialType"

let _getFakeArrayBuffer = (state, attributeBuffer: attributeBuffer, shaderIndex) => {
    return {} as WebGLBuffer
}

let _getFakeElementArrayBuffer = (state, shaderIndex) => {
    return {} as WebGLBuffer
}

let _sendAttributeData = (attributeSendMetadata: Array<attributeSendMetadata>, state: state, shaderIndex: shaderIndex, gl: WebGLRenderingContext) => {
    attributeSendMetadata.forEach(data => {
        if (!!data.elementSendMetadata) {
            data.elementSendMetadata.sendBuffer(gl, _getFakeElementArrayBuffer(state, shaderIndex))
        }
        if (!!data.instanceSendMetadata) {
            console.log("发送instance相关的顶点数据...")
        }
        if (!!data.otherSendMetadata) {
            let { pos, size, sendBuffer, buffer } = data.otherSendMetadata

            sendBuffer(gl, size, pos, _getFakeArrayBuffer(state, buffer, shaderIndex))
        }
    })
}

let _sendUniformData = (uniformSendMetadata: Array<uniformSendMetadata>, state: state, transform, material, gl: WebGLRenderingContext) => {
    uniformSendMetadata.forEach(data => {
        if (!!data.shaderSendMetadata) {
            let { pos, getData, sendData } = data.shaderSendMetadata

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
    let sendMetadataMap = state.sendMetadataMap
    let programMap = state.programMap

    getAllGameObjects(state.gameObjectState).forEach(gameObject => {
        let [material, materialType_] = getMaterial(state.gameObjectState, gameObject)
        let transform = getTransform(state.gameObjectState, gameObject)

        //不同的材质从不同的shaderIndexMap中取得shaderIndex
        let shaderIndex = null
        switch (materialType_) {
            case materialType.Basic:
                shaderIndex = ShaderUtils.getShaderIndex(state.basicMaterialShaderIndexMap, material)
                break
            case materialType.PBR:
                shaderIndex = ShaderUtils.getShaderIndex(state.pbrMaterialShaderIndexMap, material)
                break
        }

        let program = getExnFromStrictUndefined(programMap.get(shaderIndex))
        let sendMetadata = getExnFromStrictUndefined(sendMetadataMap.get(shaderIndex))

        gl.useProgram(program)

        let [attributeSendMetadata, uniformSendMetadata] = sendMetadata

        _sendAttributeData(attributeSendMetadata, state, shaderIndex, gl)
        _sendUniformData(uniformSendMetadata, state, transform, material, gl)

        console.log("其它渲染逻辑...")
    })

    return state
}
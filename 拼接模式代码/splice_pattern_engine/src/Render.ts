import { sendData, state } from "./MainStateType"
import { transform } from "./TransformStateType"
import { material } from "./BasicMaterialStateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { sendData as attributeSendData } from "./BasicMaterialShaderAttributeSender"
import { sendData as uniformSendData } from "./BasicMaterialShaderUniformSender"
import { bufferEnum, shaderName } from "../../glsl_handler/src/type/GLSLConfigType"

let _getShaderSendData = (sendData: sendData, shaderName): [Array<attributeSendData>, Array<uniformSendData>] => {
    let [_, shaderSendData] = sendData.filter(([shaderName_, _]) => {
        return shaderName_ == shaderName
    })[0]

    return shaderSendData
}

let _getFakeArrayBuffer = (state, bufferEnum: bufferEnum, shaderName) => {
    return {} as WebGLBuffer
}

let _getFakeElementArrayBuffer = (state, shaderName) => {
    return {} as WebGLBuffer
}

let _sendAttributeData = (attributeSendData: Array<attributeSendData>, state: state, shaderName: shaderName, gl: WebGLRenderingContext) => {
    attributeSendData.forEach(data => {
        if (!!data.elementSendData) {
            data.elementSendData.sendBuffer(gl, _getFakeElementArrayBuffer(state, shaderName))
        }
        else if (!!data.instanceSendData) {
            console.log("发送instance相关的顶点数据...")
        }
        else {
            let { pos, size, sendBuffer, buffer } = data.otherSendData

            sendBuffer(gl, size, pos, _getFakeArrayBuffer(state, buffer, shaderName))
        }
    })
}

let _sendUniformData = (uniformSendData: Array<uniformSendData>, state: state, transform, material, gl: WebGLRenderingContext) => {
    uniformSendData.forEach(data => {
        if (!!data.shaderSendData) {
            let { pos, getData, sendData } = data.shaderSendData

            sendData(gl, pos, getData(state))
        }
        else if (!!data.renderObjectSendModelData) {
            let { pos, getData, sendData } = data.renderObjectSendModelData

            sendData(gl, pos, getData(state, transform))
        }
        else {
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

let _getFakeShaderName = (state, material) => {
    return "render_basic" as any as shaderName
}

export let render = (state: state): state => {
    let gl = state.gl
    let sendData = state.sendData
    let programMap = state.programMap

    _getAllFakeGameObjects().forEach(gameObject => {
        let material = _getFakeMaterial(state, gameObject)
        let transform = _getFakeTransform(state, gameObject)

        let shaderName = _getFakeShaderName(state, material)
        let program = getExnFromStrictNull(programMap.get(shaderName))


        gl.useProgram(program)

        let [attributeSendData, uniformSendData] = _getShaderSendData(sendData, shaderName)

        _sendAttributeData(attributeSendData, state, shaderName, gl)
        _sendUniformData(uniformSendData, state, transform, material, gl)

        console.log("其它渲染逻辑...")
    })

    return state
}
import { state } from "./MainStateType"
import { transform } from "splice_pattern_utils/src/engine/TransformStateType"
import { material } from "splice_pattern_utils/src/engine/BasicMaterialStateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { getColor, getMapUnit, getShaderIndex, hasBasicMap } from "splice_pattern_utils/src/engine/BasicMaterial"
import { shaderIndex } from "splice_pattern_utils/src/engine/ShaderType"
import { sendFloat3, sendInt, sendMatrix4 } from "splice_pattern_utils/src/engine/GLSLSend"
import { getModelMatrix } from "splice_pattern_utils/src/engine/Transform"

let _getFakeArrayBuffer = (state, shaderIndex) => {
    return {} as WebGLBuffer
}

let _getFakeSize = (state, shaderIndex) => {
    return 3
}

let _hasElementArrayBuffer = (state, shaderIndex) => {
    return true
}

let _getFakeElementArrayBuffer = (state, shaderIndex) => {
    return {} as WebGLBuffer
}

let _sendAttributeData = (state: state, shaderIndex: shaderIndex, gl: WebGLRenderingContext, program: WebGLProgram) => {
    let pos = gl.getAttribLocation(program, "a_position")
    if (pos !== -1) {
        gl.bindBuffer(gl.ARRAY_BUFFER, _getFakeArrayBuffer(state, shaderIndex))
        gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(pos)
    }
    pos = gl.getAttribLocation(program, "a_texCoord")
    if (pos !== -1) {
        gl.bindBuffer(gl.ARRAY_BUFFER, 2)
        gl.vertexAttribPointer(pos, _getFakeSize(state, shaderIndex), gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(pos)
    }


    if (state.isSupportHardwareInstance) {
        console.log("发送instance相关的顶点数据1...")
        console.log("发送instance相关的顶点数据2...")
        console.log("发送instance相关的顶点数据3...")
        console.log("发送instance相关的顶点数据4...")
    }


    if (_hasElementArrayBuffer(state, shaderIndex)) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _getFakeElementArrayBuffer(state, shaderIndex))
    }
}

let _sendUniformData = (state: state, transform, material, gl: WebGLRenderingContext, program: WebGLProgram) => {
    let pos = getExnFromStrictNull(gl.getUniformLocation(program, "u_vMatrix"))
    sendMatrix4(gl, pos, state.vMatrix)
    pos = getExnFromStrictNull(gl.getUniformLocation(program, "u_pMatrix"))
    sendMatrix4(gl, pos, state.pMatrix)


    pos = getExnFromStrictNull(gl.getUniformLocation(program, "u_color"))
    sendFloat3(gl, pos, getColor(state.basicMaterialState, material))

    if (hasBasicMap(material, state.basicMaterialState)) {
        pos = getExnFromStrictNull(gl.getUniformLocation(program, "u_mapSampler"))
        sendInt(gl, pos, getMapUnit(state.basicMaterialState, material))
    }


    if (state.isSupportBatchInstance || !(state.isSupportHardwareInstance || state.isSupportBatchInstance)) {
        pos = getExnFromStrictNull(gl.getUniformLocation(program, "u_mMatrix"))
        sendMatrix4(gl, pos, getModelMatrix(state.transformState, transform))
    }
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
    let programMap = state.programMap

    _getAllFakeGameObjects().forEach(gameObject => {
        let material = _getFakeMaterial(state, gameObject)
        let transform = _getFakeTransform(state, gameObject)

        let shaderIndex = getShaderIndex(state.basicMaterialState, material)

        let program = getExnFromStrictNull(programMap.get(shaderIndex))


        gl.useProgram(program)

        _sendAttributeData(state, shaderIndex, gl, program)
        _sendUniformData(state, transform, material, gl, program)

        console.log("其它渲染逻辑...")
    })

    return state
}
import { state } from "./EngineStateType"
import { getExnFromStrictNull, getExnFromStrictUndefined } from "commonlib-ts/src/NullableUtils"
import { getColor, getMapUnit, hasBasicMap } from "splice_pattern_utils/src/engine/BasicMaterial"
import { shaderIndex } from "splice_pattern_utils/src/engine/ShaderType"
import { sendFloat3, sendInt, sendMatrix4 } from "splice_pattern_utils/src/engine/GLSLSend"
import { getModelMatrix } from "splice_pattern_utils/src/engine/Transform"
import { getShaderIndex } from "splice_pattern_utils/src/engine/Shader"
import { getDiffuse, getDiffuseMapUnit, hasDiffuseMap } from "splice_pattern_utils/src/engine/PBRMaterial"
import { getAllGameObjects, getMaterial, getTransform } from "splice_pattern_utils/src/engine/GameObject"
import { materialType } from "splice_pattern_utils/src/engine/MaterialType"

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

    if (state.isSupportInstance) {
        console.log("发送instance相关的顶点数据1...")
        console.log("发送instance相关的顶点数据2...")
        console.log("发送instance相关的顶点数据3...")
        console.log("发送instance相关的顶点数据4...")
    }

    if (_hasElementArrayBuffer(state, shaderIndex)) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _getFakeElementArrayBuffer(state, shaderIndex))
    }
}

let _sendUniformData = (state: state, transform, [material, materialType_], gl: WebGLRenderingContext, program: WebGLProgram) => {
    let pos = getExnFromStrictNull(gl.getUniformLocation(program, "u_vMatrix"))
    sendMatrix4(gl, pos, state.vMatrix)

    pos = getExnFromStrictNull(gl.getUniformLocation(program, "u_pMatrix"))
    sendMatrix4(gl, pos, state.pMatrix)

    switch (materialType_) {
        case materialType.Basic:
            pos = getExnFromStrictNull(gl.getUniformLocation(program, "u_color"))
            sendFloat3(gl, pos, getColor(state.basicMaterialState, material))

            if (hasBasicMap(state.basicMaterialState, material)) {
                pos = getExnFromStrictNull(gl.getUniformLocation(program, "u_mapSampler"))
                sendInt(gl, pos, getMapUnit(state.basicMaterialState, material))
            }
            break
        case materialType.PBR:
            pos = getExnFromStrictNull(gl.getUniformLocation(program, "u_diffuse"))
            sendFloat3(gl, pos, getDiffuse(state.pbrMaterialState, material))

            if (hasDiffuseMap(state.pbrMaterialState, material)) {
                pos = getExnFromStrictNull(gl.getUniformLocation(program, "u_diffuseMapSampler"))
                sendInt(gl, pos, getDiffuseMapUnit(state.pbrMaterialState, material))
            }
            break
        default:
            throw new Error()
    }

    if (!state.isSupportInstance) {
        pos = getExnFromStrictNull(gl.getUniformLocation(program, "u_mMatrix"))
        sendMatrix4(gl, pos, getModelMatrix(state.transformState, transform))
    }
}

export let render = (state: state): state => {
    let gl = state.gl
    let programMap = state.programMap

    getAllGameObjects(state.gameObjectState).forEach(gameObject => {
        let [material, materialType_] = getMaterial(state.gameObjectState, gameObject)
        let transform = getTransform(state.gameObjectState, gameObject)

        //不同的材质从不同的shaderIndexMap中取得shaderIndex
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

        gl.useProgram(program)

        _sendAttributeData(state, shaderIndex, gl, program)
        _sendUniformData(state, transform, [material, materialType_], gl, program)

        console.log("其它渲染逻辑...")
    })

    return state
}
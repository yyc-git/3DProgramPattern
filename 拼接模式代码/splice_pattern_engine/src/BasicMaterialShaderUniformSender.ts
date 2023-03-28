import { state } from "./MainStateType"
import { material } from "./BasicMaterialStateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { uniformName, uniformField, uniformType, uniformFrom } from "./GLSLConfigType";
import { transform } from "./TransformStateType";
import { getColor, getMapUnit } from "./BasicMaterial";
import { getModelMatrix } from "./Transform";

type getBasicMaterialDataFunc = (state: state, material: material) => any

type getCameraDataFunc = (state: state) => any

type getModelDataFunc = (state: state, transform: transform) => Float32Array

type sendDataFunc = (gl: WebGLRenderingContext, pos: WebGLUniformLocation, data: any) => void

type singleSendData<getDataFunc> = {
    pos: WebGLUniformLocation,
    getData: getDataFunc,
    sendData: sendDataFunc,
}

export type sendData = {
    shaderSendData?: singleSendData<getCameraDataFunc>,
    renderObjectSendModelData?: singleSendData<getModelDataFunc>,
    renderObjectSendMaterialData?: singleSendData<getBasicMaterialDataFunc>
}

let _sendMatrix4 = (gl, pos: WebGLUniformLocation, value: Float32Array) => gl.uniformMatrix4fv(pos, false, value)

let _sendInt = (gl, pos: WebGLUniformLocation, value: number) => gl.uniform1i(pos, value)

let _sendFloat1 = (gl, pos: WebGLUniformLocation, value: number) => gl.uniform1f(pos, value)

let _sendFloat3 = (gl, pos: WebGLUniformLocation, [x, y, z]: [number, number, number]) => gl.uniform3f(pos, x, y, z)

let _getSendDataByType = (type: uniformType) => {
    switch (type) {
        case "mat4":
            return _sendMatrix4
        case "sampler2D":
            return _sendInt
        case "float":
            return _sendFloat1
        case "float3":
            return _sendFloat3
        default:
            throw new Error()
    }
}

let _addBasicMaterialSendData = (sendDataArr: Array<sendData>, [pos, field, type]: [WebGLUniformLocation, uniformField, uniformType]
): Array<sendData> => {
    let renderObjectSendMaterialData = null

    switch (field) {
        case "color":
            renderObjectSendMaterialData = {
                pos: pos,
                getData: (state, material) => getColor(state.basicMaterialState, material),
                sendData: _getSendDataByType(type)
            }

            break
        case "map":
            renderObjectSendMaterialData = {
                pos: pos,
                getData: (state, material) => getMapUnit(state.basicMaterialState, material),
                sendData: _getSendDataByType(type)
            }

            break
        default:
            throw new Error()
    }

    sendDataArr.push({ renderObjectSendMaterialData })

    return sendDataArr
}

let _addCameraSendData = (sendDataArr: Array<sendData>, [pos, field, type]: [WebGLUniformLocation, uniformField, uniformType]
): Array<sendData> => {
    let shaderSendData = null

    switch (field) {
        case "vMatrix":
            shaderSendData = {
                pos: pos,
                getData: (state) => state.vMatrix,
                sendData: _getSendDataByType(type)
            }

            break
        case "pMatrix":
            shaderSendData = {
                pos: pos,
                getData: (state) => state.pMatrix,
                sendData: _getSendDataByType(type)
            }

            break
        default:
            throw new Error()
    }

    sendDataArr.push({ shaderSendData })

    return sendDataArr
}

let _addModelSendData = (sendDataArr: Array<sendData>, [pos, field, type]: [WebGLUniformLocation, uniformField, uniformType]
): Array<sendData> => {
    let renderObjectSendModelData = null

    switch (field) {
        case "mMatrix":
            renderObjectSendModelData = {
                pos: pos,
                getData: (state, transform) => getModelMatrix(state, transform),
                sendData: _getSendDataByType(type)
            }

            break
        default:
            throw new Error()
    }

    sendDataArr.push({ renderObjectSendModelData })

    return sendDataArr
}

export let addUniformSendData = (
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    sendDataArr: Array<sendData>, [name, field, type, from]: [uniformName, uniformField, uniformType, uniformFrom]
): Array<sendData> => {
    let pos = getExnFromStrictNull(gl.getUniformLocation(program, name))

    switch (from) {
        case "basicMaterial":
            _addBasicMaterialSendData(sendDataArr, [pos, field, type])
            break
        case "camera":
            _addCameraSendData(sendDataArr, [pos, field, type])
            break
        case "model":
            _addModelSendData(sendDataArr, [pos, field, type])
            break
    }

    return sendDataArr
}
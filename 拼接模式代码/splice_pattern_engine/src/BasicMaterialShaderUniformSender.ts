import { state } from "./MainStateType"
import { material } from "splice_pattern_utils/src/engine/BasicMaterialStateType"
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import {  uniformField, uniformType, uniformFrom } from "./GLSLConfigType";
import { transform } from "splice_pattern_utils/src/engine/TransformStateType";
import { getColor, getMapUnit } from "splice_pattern_utils/src/engine/BasicMaterial";
import { getModelMatrix } from "splice_pattern_utils/src/engine/Transform";
import { sendFloat1, sendFloat3, sendInt, sendMatrix4 } from "splice_pattern_utils/src/engine/GLSLSend";
import { uniformName } from "glsl_handler/src/type/GLSLConfigType.gen";

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

let _getSendDataByType = (type: uniformType) => {
    switch (type) {
        case "mat4":
            return sendMatrix4
        case "sampler2D":
            return sendInt
        case "float":
            return sendFloat1
        case "float3":
            return sendFloat3
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
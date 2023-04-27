import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { uniformField, uniformType, uniformFrom } from "./GLSLConfigType";
import { getColor, getMapUnit } from "splice_pattern_utils/src/engine/BasicMaterial";
import { uniformName } from "chunk_handler/src/type/GLSLConfigType.gen";
import { sendData } from "./MaterialShaderUniformSenderType"
import { addCameraSendData, addModelSendData, getSendDataByType } from "./MaterialShaderUniformSenderUtils";

let _addBasicMaterialSendData = (sendDataArr: Array<sendData>, [pos, field, type]: [WebGLUniformLocation, uniformField, uniformType]
): Array<sendData> => {
    let renderObjectSendMaterialData = null

    switch (field) {
        case "color":
            renderObjectSendMaterialData = {
                pos: pos,
                getData: (state, material) => getColor(state.basicMaterialState, material),
                sendData: getSendDataByType(type)
            }

            break
        case "map":
            renderObjectSendMaterialData = {
                pos: pos,
                getData: (state, material) => getMapUnit(state.basicMaterialState, material),
                sendData: getSendDataByType(type)
            }

            break
        default:
            throw new Error()
    }

    sendDataArr.push({ renderObjectSendMaterialData })

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
            addCameraSendData(sendDataArr, [pos, field, type])
            break
        case "model":
            addModelSendData(sendDataArr, [pos, field, type])
            break
    }

    return sendDataArr
}
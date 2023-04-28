import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { uniformField, uniformType, uniformFrom } from "./GLSLConfigType";
import { getColor, getMapUnit } from "splice_pattern_utils/src/engine/BasicMaterial";
import { uniformName } from "chunk_handler/src/type/GLSLConfigType.gen";
import { sendConfig } from "./MaterialShaderUniformSenderType"
import { addCameraSendConfig, addModelSendConfig, getSendDataByType } from "./MaterialShaderUniformSenderUtils";

let _addBasicMaterialSendConfig = (sendConfigArr: Array<sendConfig>, [pos, field, type]: [WebGLUniformLocation, uniformField, uniformType]
): Array<sendConfig> => {
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

    sendConfigArr.push({ renderObjectSendMaterialData })

    return sendConfigArr
}

export let addUniformSendConfig = (
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    sendConfigArr: Array<sendConfig>, [name, field, type, from]: [uniformName, uniformField, uniformType, uniformFrom]
): Array<sendConfig> => {
    let pos = getExnFromStrictNull(gl.getUniformLocation(program, name))

    switch (from) {
        case "basicMaterial":
            _addBasicMaterialSendConfig(sendConfigArr, [pos, field, type])
            break
        case "camera":
            addCameraSendConfig(sendConfigArr, [pos, field, type])
            break
        case "model":
            addModelSendConfig(sendConfigArr, [pos, field, type])
            break
    }

    return sendConfigArr
}
import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { uniformField, uniformType, uniformFrom } from "./GLSLConfigType";
import { getDiffuse, getDiffuseMapUnit } from "splice_pattern_utils/src/engine/PBRMaterial";
import { uniformName } from "chunk_handler/src/type/GLSLConfigType.gen";
import { sendConfig } from "./MaterialShaderUniformSenderType"
import { addCameraSendConfig, addModelSendConfig, getSendDataByType } from "./MaterialShaderUniformSenderUtils";

let _addPBRMaterialSendConfig = (sendConfigArr: Array<sendConfig>, [pos, field, type]: [WebGLUniformLocation, uniformField, uniformType]
): Array<sendConfig> => {
    let renderObjectSendMaterialData = null

    switch (field) {
        case "color":
            renderObjectSendMaterialData = {
                pos: pos,
                getData: (state, material) => getDiffuse(state.pbrMaterialState, material),
                sendData: getSendDataByType(type)
            }

            break
        case "map":
            renderObjectSendMaterialData = {
                pos: pos,
                getData: (state, material) => getDiffuseMapUnit(state.pbrMaterialState, material),
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
        case "pbrMaterial":
            _addPBRMaterialSendConfig(sendConfigArr, [pos, field, type])
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
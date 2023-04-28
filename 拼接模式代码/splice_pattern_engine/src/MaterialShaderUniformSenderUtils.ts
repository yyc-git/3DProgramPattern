import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { uniformField, uniformType, uniformFrom } from "./GLSLConfigType";
import { getModelMatrix } from "splice_pattern_utils/src/engine/Transform";
import { sendFloat1, sendFloat3, sendInt, sendMatrix4 } from "splice_pattern_utils/src/engine/GLSLSend";
import { sendConfig } from "./MaterialShaderUniformSenderType"

export let getSendDataByType = (type: uniformType) => {
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

export let addCameraSendConfig = (sendConfigArr: Array<sendConfig>, [pos, field, type]: [WebGLUniformLocation, uniformField, uniformType]
): Array<sendConfig> => {
    let shaderSendConfig = null

    switch (field) {
        case "vMatrix":
            shaderSendConfig = {
                pos: pos,
                getData: (state) => state.vMatrix,
                sendData: getSendDataByType(type)
            }

            break
        case "pMatrix":
            shaderSendConfig = {
                pos: pos,
                getData: (state) => state.pMatrix,
                sendData: getSendDataByType(type)
            }

            break
        default:
            throw new Error()
    }

    sendConfigArr.push({ shaderSendConfig })

    return sendConfigArr
}

export let addModelSendConfig = (sendConfigArr: Array<sendConfig>, [pos, field, type]: [WebGLUniformLocation, uniformField, uniformType]
): Array<sendConfig> => {
    let renderObjectSendModelData = null

    switch (field) {
        case "mMatrix":
            renderObjectSendModelData = {
                pos: pos,
                getData: (state, transform) => getModelMatrix(state, transform),
                sendData: getSendDataByType(type)
            }

            break
        default:
            throw new Error()
    }

    sendConfigArr.push({ renderObjectSendModelData })

    return sendConfigArr
}

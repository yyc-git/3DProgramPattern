import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { uniformField, uniformType, uniformFrom } from "./GLSLConfigType";
import { getModelMatrix } from "splice_pattern_utils/src/engine/Transform";
import { sendFloat1, sendFloat3, sendInt, sendMatrix4 } from "splice_pattern_utils/src/engine/GLSLSend";
import { sendMetadata } from "./MaterialShaderUniformSenderType"

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

export let addCameraSendMetadata = (sendMetadataArr: Array<sendMetadata>, [pos, field, type]: [WebGLUniformLocation, uniformField, uniformType]
): Array<sendMetadata> => {
    let shaderSendMetadata = null

    switch (field) {
        case "vMatrix":
            shaderSendMetadata = {
                pos: pos,
                getData: (state) => state.vMatrix,
                sendData: getSendDataByType(type)
            }

            break
        case "pMatrix":
            shaderSendMetadata = {
                pos: pos,
                getData: (state) => state.pMatrix,
                sendData: getSendDataByType(type)
            }

            break
        default:
            throw new Error()
    }

    sendMetadataArr.push({ shaderSendMetadata })

    return sendMetadataArr
}

export let addModelSendMetadata = (sendMetadataArr: Array<sendMetadata>, [pos, field, type]: [WebGLUniformLocation, uniformField, uniformType]
): Array<sendMetadata> => {
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

    sendMetadataArr.push({ renderObjectSendModelData })

    return sendMetadataArr
}

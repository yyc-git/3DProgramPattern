import { getExnFromStrictNull } from "commonlib-ts/src/NullableUtils"
import { uniformField, uniformType, uniformFrom } from "./GLSLConfigType";
import { getDiffuse, getDiffuseMapUnit } from "splice_pattern_utils/src/engine/PBRMaterial";
import { uniformName } from "chunk_handler/src/type/GLSLConfigType.gen";
import { sendMetadata } from "./MaterialShaderUniformSenderType"
import { addCameraSendMetadata, addModelSendMetadata, getSendDataByType } from "./MaterialShaderUniformSenderUtils";

let _addPBRMaterialSendMetadata = (sendMetadataArr: Array<sendMetadata>, [pos, field, type]: [WebGLUniformLocation, uniformField, uniformType]
): Array<sendMetadata> => {
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

    sendMetadataArr.push({ renderObjectSendMaterialData })

    return sendMetadataArr
}

export let addUniformSendMetadata = (
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    sendMetadataArr: Array<sendMetadata>, [name, field, type, from]: [uniformName, uniformField, uniformType, uniformFrom]
): Array<sendMetadata> => {
    let pos = getExnFromStrictNull(gl.getUniformLocation(program, name))

    switch (from) {
        case "pbrMaterial":
            _addPBRMaterialSendMetadata(sendMetadataArr, [pos, field, type])
            break
        case "camera":
            addCameraSendMetadata(sendMetadataArr, [pos, field, type])
            break
        case "model":
            addModelSendMetadata(sendMetadataArr, [pos, field, type])
            break
    }

    return sendMetadataArr
}
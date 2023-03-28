import { shaderLibs, shaderMapDataName, shaderMapDataValue, condition, shaders, attributeName, bufferEnum, attributeType, uniformName, uniformField, uniformType, uniformFrom, shaderName } from "./type/GLSLConfigType";

export function parseGLSLConfig(
    shadersJson: JSON, shaderLibsJson: JSON
): [shaders, shaderLibs]

type isNameValidForStaticBranch = (name: string) => boolean

type getShaderLibFromStaticBranch = (name: shaderMapDataName, value: shaderMapDataValue) => shaderLibs

type isPassForDynamicBranch = (condition: condition) => boolean

type addAttributeSendData<SendData> = (sendDataArr: Array<SendData>, [name, buffer, type]: [attributeName, bufferEnum, attributeType]) => Array<SendData>

type addUniformSendData<SendData> = (sendDataArr: Array<SendData>, [name, field, type, from]: [uniformName, uniformField, uniformType, uniformFrom]) => Array<SendData>

export function buildGLSL(
    [
        [isNameValidForStaticBranch, getShaderLibFromStaticBranch],
        isPassForDynamicBranch
    ]: [

            [isNameValidForStaticBranch, getShaderLibFromStaticBranch],
            isPassForDynamicBranch
        ],
    shaders: shaders, shaderLibs: shaderLibs
): [Array<[shaderName, shaderLibs]>, Array<[shaderName, shaderLibs]>]

export type sendDataOfAllMaterialShaders<AttributeSendData, UniformSendData> = Array<[shaderName, [
    Array<AttributeSendData>,
    Array<UniformSendData>
]]>

export function getSendDataOfAllMaterialShaders<AttributeSendData, UniformSendData>(
    [
        addAttributeSendData,
        addUniformSendData
    ]: [
            addAttributeSendData<AttributeSendData>,
            addUniformSendData<UniformSendData>
        ],
    shaderLibDataOfAllMaterialShaders: Array<[shaderName, shaderLibs]>
): sendDataOfAllMaterialShaders<AttributeSendData, UniformSendData>
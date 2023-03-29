import { shaderLibs, shaderMapDataName, shaderMapDataValue, condition, shaders, attributeName, attributeBuffer, attributeType, uniformName, uniformField, uniformType, uniformFrom, shaderName, glslName } from "./type/GLSLConfigType.gen";
import { glslChunk } from "glsl_converter/src/ShaderChunkType.gen"

export function parseGLSLConfig(
    shadersJson: JSON, shaderLibsJson: JSON
): [shaders, shaderLibs]

type isNameValidForStaticBranch = (name: string) => boolean

type getShaderLibFromStaticBranch = (name: shaderMapDataName, value: shaderMapDataValue) => shaderLibs

type isPassForDynamicBranch = (condition: condition) => boolean

type addAttributeSendData<SendData> = (sendDataArr: Array<SendData>, [name, attributeBuffer, type]: [attributeName, attributeBuffer, attributeType]) => Array<SendData>

type addUniformSendData<SendData> = (sendDataArr: Array<SendData>, [name, field, type, from]: [uniformName, uniformField, uniformType, uniformFrom]) => Array<SendData>

type generateAttributeType = (attributeType: attributeType) => string

type generateUniformType = (uniformType: uniformType) => string

type buildGLSLChunk = (glslName: glslName) => glslChunk

type vsGLSL = string

type fsGLSL = string

export function buildGLSL(
    [
        [[isNameValidForStaticBranch, getShaderLibFromStaticBranch],
            isPassForDynamicBranch],
        [
            generateAttributeType,
            generateUniformType,
            buildGLSLChunkInVS,
            buildGLSLChunkInFS
        ]
    ]: [
            [
                [isNameValidForStaticBranch, getShaderLibFromStaticBranch],
                isPassForDynamicBranch],
            [
                generateAttributeType,
                generateUniformType,
                buildGLSLChunk,
                buildGLSLChunk
            ]
        ],
    shaders: shaders,
    shaderLibs: shaderLibs,
    shaderChunk: Record<glslName, glslChunk>,
    precision: "highp" | "mediump" | "lowp"
): [
        Array<[shaderName, shaderLibs]>,
        Array<[shaderName, [vsGLSL, fsGLSL]]>
    ]


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
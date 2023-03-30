import { shaderLibs, shaderMapDataName, shaderMapDataValue, condition, shaders, attributeName, attributeBuffer, attributeType, uniformName, uniformField, uniformType, uniformFrom, shaderName, glslName } from "./type/GLSLConfigType.gen";
import { glslChunk } from "../../glsl_converter/src/ChunkType.gen"

export function parseGLSLConfig(
    shadersJson: JSON, shaderLibsJson: JSON
): [shaders, shaderLibs]

type isNameValidForStaticBranch = (name: string) => boolean

type getShaderLibFromStaticBranch = (name: shaderMapDataName, value: shaderMapDataValue) => string

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
    shaderName: shaderName,
    shaderLibs: shaderLibs,
    chunk: Record<glslName, glslChunk>,
    precision: "highp" | "mediump" | "lowp"
): [
        shaderLibs,
        [vsGLSL, fsGLSL]
    ]


export type sendData<AttributeSendData, UniformSendData> = [
    Array<AttributeSendData>,
    Array<UniformSendData>
]

export function getSendData<AttributeSendData, UniformSendData>(
    [
        addAttributeSendData,
        addUniformSendData
    ]: [
            addAttributeSendData<AttributeSendData>,
            addUniformSendData<UniformSendData>
        ],
    shaderLib: shaderLibs
): sendData<AttributeSendData, UniformSendData>
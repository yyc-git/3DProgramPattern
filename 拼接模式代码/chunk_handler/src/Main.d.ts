import { shaderChunks, shaderMapDataName, shaderMapDataValue, condition, shaders, attributeName, attributeBuffer, attributeType, uniformName, uniformField, uniformType, uniformFrom, shaderName, glslName } from "./type/GLSLConfigType.gen";
import { glslChunk } from "../../chunk_converter/src/ChunkType.gen"

export function parseConfig(
    shadersJson: JSON, shaderChunksJson: JSON
): [shaders, shaderChunks]

type isNameValidForStaticBranch = (name: string) => boolean

type getShaderChunkFromStaticBranch = (name: shaderMapDataName, value: shaderMapDataValue) => string

type isPassForDynamicBranch = (condition: condition) => boolean

type addAttributeSendMetadata<SendMetadata> = (sendDataArr: Array<SendMetadata>, [name, attributeBuffer, type]: [attributeName, attributeBuffer, attributeType]) => Array<SendMetadata>

type addUniformSendMetadata<SendMetadata> = (sendDataArr: Array<SendMetadata>, [name, field, type, from]: [uniformName, uniformField, uniformType, uniformFrom]) => Array<SendMetadata>

type generateAttributeType = (attributeType: attributeType) => string

type generateUniformType = (uniformType: uniformType) => string

type buildGLSLChunk = (glslName: glslName) => glslChunk

type vsGLSL = string

type fsGLSL = string

export function buildGLSL(
    [
        [[isNameValidForStaticBranch, getShaderChunkFromStaticBranch],
            isPassForDynamicBranch],
        [
            generateAttributeType,
            generateUniformType,
            buildGLSLChunkInVS,
            buildGLSLChunkInFS
        ]
    ]: [
            [
                [isNameValidForStaticBranch, getShaderChunkFromStaticBranch],
                isPassForDynamicBranch],
            [
                generateAttributeType,
                generateUniformType,
                buildGLSLChunk,
                buildGLSLChunk
            ]
        ],
    shaders: shaders,
    shaderChunks: shaderChunks,
    chunk: Record<glslName, glslChunk>,
    shaderName: shaderName,
    precision: "highp" | "mediump" | "lowp"
): [
        shaderChunks,
        [vsGLSL, fsGLSL]
    ]


export type sendMetadata<AttributeSendMetadata, UniformSendMetadata> = [
    Array<AttributeSendMetadata>,
    Array<UniformSendMetadata>
]

export function buildSendMetadata<AttributeSendMetadata, UniformSendMetadata>(
    [
        addAttributeSendMetadata,
        addUniformSendMetadata
    ]: [
            addAttributeSendMetadata<AttributeSendMetadata>,
            addUniformSendMetadata<UniformSendMetadata>
        ],
    shaderLib: shaderChunks
): sendMetadata<AttributeSendMetadata, UniformSendMetadata>
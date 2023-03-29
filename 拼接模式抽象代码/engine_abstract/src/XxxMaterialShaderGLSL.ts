import { glslChunk } from "glsl_converter/src/ShaderChunkType.gen"
import { state } from "./MainStateType"
import { attributeType, uniformType, glslNameForBuildGLSLChunk, shaderMapDataName, condition } from "./GLSLConfigType"
import { shaderMapDataValue } from "glsl_handler/src/type/GLSLConfigType.gen"

export declare function isNameValidForStaticBranch(name: shaderMapDataName): boolean

export declare function getShaderLibFromStaticBranch(state: state, name: shaderMapDataName, value: shaderMapDataValue): string

export declare function isPassForDynamicBranch(material, state: state, condition: condition): boolean

export declare function generateAttributeType(attributeType: attributeType): string

export declare function generateUniformType(uniformType: uniformType): string

export declare function buildGLSLChunkInVS(state: state, glslName: glslNameForBuildGLSLChunk): glslChunk

export declare function buildGLSLChunkInFS(state: state, glslName: glslNameForBuildGLSLChunk): glslChunk
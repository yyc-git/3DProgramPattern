import { shaderLibs, shaderMapDataName, shaderMapDataValue, condition, shaders } from "./GLSLConfigType.gen";


export function parseGLSLConfig(
    shadersJson: JSON, shaderLibsJson: JSON
): [shaders, shaderLibs]

type isNameValidForStaticBranch = (name: string) => boolean

type getShaderLibFromStaticBranch = (name: shaderMapDataName, value: shaderMapDataValue) => shaderLibs

type isPassForDynamicBranch = (condition: condition) => boolean

export function handleGLSL(
    [
        [isNameValidForStaticBranch, getShaderLibFromStaticBranch],
        isPassForDynamicBranch
    ]: [

            [isNameValidForStaticBranch, getShaderLibFromStaticBranch],
            isPassForDynamicBranch
        ],
    shaders: shaders, shaderLibs: shaderLibs
): void
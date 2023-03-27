import { shaderLibs, shaderMapDataName, shaderMapDataValue, condition } from "./GLSLConfigType.gen";

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
    shadersJson: JSON, shaderLibsJson: JSON
): void
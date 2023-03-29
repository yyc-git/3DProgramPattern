import { Map } from "immutable"
import { getExnFromStrictNull, getExnFromStrictUndefined } from "commonlib-ts/src/NullableUtils"
import { shaderIndex } from "./ShaderType"

type glslMap = Map<shaderIndex, glsl>

type glsl = [string, string]

export let generateShaderIndex = (glslMap: glslMap, glsl: glsl, maxShaderIndex: shaderIndex): [shaderIndex, shaderIndex] => {
    let result = glslMap.findEntry((value) => {
        return value[0] == glsl[0] && value[1] == glsl[1]
    })

    if (result === undefined) {
        return [maxShaderIndex, maxShaderIndex + 1]
    }

    return [getExnFromStrictUndefined(result[0]), maxShaderIndex]
}

export let createFakeProgram = ([vsGLSL, fsGLSL]) => {
    let fakeProgram = {} as any as WebGLProgram

    return fakeProgram
}

export let getShaderIndex = (shaderIndexMap, material) => {
    return getExnFromStrictNull(shaderIndexMap.get(material))
}

export let setShaderIndex = (shaderIndexMap, material, shaderIndex) => {
    return shaderIndexMap.set(material, shaderIndex)
}
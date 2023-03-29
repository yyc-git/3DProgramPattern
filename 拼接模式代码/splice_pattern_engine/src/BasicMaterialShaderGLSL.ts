import { glslChunk } from "glsl_converter/src/ShaderChunkType.gen"
import { hasBasicMap } from "splice_pattern_utils/src/engine/BasicMaterial"
import { state } from "./MainStateType"
import { attributeType, uniformType, glslNameForBuildGLSLChunk } from "./GLSLConfigType"

export let isNameValidForStaticBranch = (name) => {
    switch (name) {
        case "modelMatrix_instance":
            return true
        default:
            return false
    }
}

export let getShaderLibFromStaticBranch = (state: state, name, value) => {
    switch (name) {
        case "modelMatrix_instance":
            if (state.isSupportHardwareInstance) {
                return value[1]
            }
            else if (state.isSupportBatchInstance) {
                return value[2]
            }
            else {
                return value[0]
            }
        default:
            throw new Error("unknown name: " + name)
    }
}

export let isPassForDynamicBranch = (material, state: state, condition) => {
    switch (condition) {
        case "basic_has_map":
            return hasBasicMap(material, state.basicMaterialState)
        default:
            throw new Error("unknown condition: " + condition)
    }
}

export let generateAttributeType = (attributeType: attributeType): string => {
    return attributeType
}

export let generateUniformType = (uniformType: uniformType): string => {
    switch (uniformType) {
        case "float3":
            return "vec3"
        default:
            return uniformType
    }
}

export let buildGLSLChunkInVS = (state: state, glslName: glslNameForBuildGLSLChunk): glslChunk => {
    switch (glslName) {
        case "defineMaxDirectionLightCount":
            return {
                top: "",
                define: "",
                varDeclare: "",
                funcDeclare: "",
                funcDefine: "",
                body: "",
            }
        default:
            throw new Error()
    }
}

export let buildGLSLChunkInFS = (state: state, glslName: glslNameForBuildGLSLChunk): glslChunk => {
    switch (glslName) {
        case "defineMaxDirectionLightCount":
            let maxDirectionLightCount = state.maxDirectionLightCount
            return {
                top: "",
                define: "#define MAX_DIRECTION_LIGHT_COUNT " + maxDirectionLightCount,
                varDeclare: "",
                funcDeclare: "",
                funcDefine: "",
                body: "",
            }
        default:
            throw new Error()
    }
}

export let buildGLSLChunk = (state: state, glslName: glslNameForBuildGLSLChunk): glslChunk => {
    switch (glslName) {
        case "defineMaxDirectionLightCount":
            let maxDirectionLightCount = state.maxDirectionLightCount
            return {
                top: "",
                define: "#define MAX_DIRECTION_LIGHT_COUNT " + maxDirectionLightCount,
                varDeclare: "",
                funcDeclare: "",
                funcDefine: "",
                body: "",
            }
        default:
            throw new Error()
    }
}
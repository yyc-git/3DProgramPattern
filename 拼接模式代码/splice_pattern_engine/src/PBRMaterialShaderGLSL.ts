import { hasDiffuseMap } from "splice_pattern_utils/src/engine/PBRMaterial"
import { state } from "./EngneStateType"
import { condition } from "./GLSLConfigType"
import * as MaterialShaderGLSLUtils from "./MaterialShaderGLSLUtils"

export let isNameValidForStaticBranch = MaterialShaderGLSLUtils.isNameValidForStaticBranch

export let getShaderChunkFromStaticBranch = MaterialShaderGLSLUtils.getShaderChunkFromStaticBranch

export let isPassForDynamicBranch = (material, state: state, condition: condition): boolean => {
    switch (condition) {
        case "diffuse_has_map":
            return hasDiffuseMap(state.pbrMaterialState, material)
        default:
            throw new Error("unknown condition: " + condition)
    }
}

export let generateAttributeType = MaterialShaderGLSLUtils.generateAttributeType

export let generateUniformType = MaterialShaderGLSLUtils.generateUniformType

export let buildGLSLChunkInVS = MaterialShaderGLSLUtils.buildGLSLChunkInVS

export let buildGLSLChunkInFS = MaterialShaderGLSLUtils.buildGLSLChunkInFS
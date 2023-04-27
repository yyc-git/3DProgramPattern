import { state as gameObjectState } from "splice_pattern_utils/src/engine/GameObjectStateType"
import { state as transformState } from "splice_pattern_utils/src/engine/TransformStateType"
import type { Map } from "immutable"
import { shaderIndex } from "splice_pattern_utils/src/engine/ShaderType"
import * as BasicMaterialStateType from "splice_pattern_utils/src/engine/BasicMaterialStateType"
import * as PBRMaterialStateType from "splice_pattern_utils/src/engine/PBRMaterialStateType"

export type programMap = Map<shaderIndex, WebGLProgram>

export type state = {
    gl: WebGLRenderingContext,
    programMap: programMap,
    maxShaderIndex: number,
    basicMaterialShaderIndexMap: Map<BasicMaterialStateType.material, shaderIndex>,
    pbrMaterialShaderIndexMap: Map<PBRMaterialStateType.material, shaderIndex>,
    vMatrix: Float32Array | null,
    pMatrix: Float32Array | null,
    isSupportInstance: boolean,
    maxDirectionLightCount: number,

    gameObjectState: gameObjectState,
    basicMaterialState: BasicMaterialStateType.state,
    pbrMaterialState: PBRMaterialStateType.state,
    transformState: transformState
}
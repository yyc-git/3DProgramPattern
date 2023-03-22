import type {Map} from "immutable"
import { component as material } from "multithread_pattern_ecs/src/component/NoLightMaterialComponentType"

export const pipelineName = "Worker_Render"

type vbo = {
    verticesVBO: WebGLBuffer | null,
    indicesVBO: WebGLBuffer | null,
}

export type state = {
    gl: WebGLRenderingContext | null,
    program: WebGLProgram | null,
    vbo: vbo,
    viewMatrix: Float32Array | null,
    pMatrix: Float32Array | null,
    typeArray: null | Uint32Array,
    renderGameObjectsCount: number | null
    canvas: OffscreenCanvas | null,
    allMaterialIndices: Array<material> | null,
    transformComponentCount: number | null,
    noLightMaterialComponentCount: number | null,
    transformComponentBuffer: SharedArrayBuffer | null,
    noLightMaterialComponentBuffer: OffscreenCanvas | null,
}

export type states = {
    [pipelineName]: state,
}

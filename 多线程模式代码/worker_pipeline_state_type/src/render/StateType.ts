import { component as material } from "multithread_pattern_ecs/src/component/BasicMaterialComponentType"

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
    renderDataBuffer: SharedArrayBuffer | null,
    typeArray: Uint32Array | null,
    renderGameObjectsCount: number | null
    canvas: OffscreenCanvas | null,
    allMaterialIndices: Array<material> | null,
    transformComponentCount: number | null,
    basicMaterialComponentCount: number | null,
    transformComponentBuffer: SharedArrayBuffer | null,
    basicMaterialComponentBuffer: SharedArrayBuffer | null,
}

export type states = {
    [pipelineName]: state,
}

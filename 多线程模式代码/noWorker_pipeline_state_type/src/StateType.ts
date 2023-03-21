import type { Map } from "immutable"
import { component as material } from "multithread_pattern_ecs/src/component/NoLightMaterialComponentType"

export const pipelineName = "NoWorker"

type vbo = {
    verticesVBO: WebGLBuffer | null,
    indicesVBO: WebGLBuffer | null,
}

export type state = {
    gl: WebGLRenderingContext | null,
    programMap: Map<material, WebGLProgram>,
    vbo: vbo
}

export type states = {
    [pipelineName]: state,
}

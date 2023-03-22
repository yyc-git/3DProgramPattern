export const pipelineName = "NoWorker"

type vbo = {
    verticesVBO: WebGLBuffer | null,
    indicesVBO: WebGLBuffer | null,
}

export type state = {
    gl: WebGLRenderingContext | null,
    program: WebGLProgram | null,
    vbo: vbo
}

export type states = {
    [pipelineName]: state,
}

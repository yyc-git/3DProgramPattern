export const pipelineName = "JiaRenderInMobile"

export type state = {
    gl: WebGLRenderingContext | null
}

export type states = {
    [pipelineName]: state,
}

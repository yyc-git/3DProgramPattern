export const pipelineName = "RenderInPC"

export type state = {
    gl: WebGL2RenderingContext | null
}

export type states = {
    [pipelineName]: state,
}

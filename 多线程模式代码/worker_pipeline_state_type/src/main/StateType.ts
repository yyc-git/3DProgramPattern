export const pipelineName = "Worker_Main"

export type state = {
    worker: Worker | null,
    typeArray: null | Uint32Array,
    renderGameObjectsCount: number | null
}

export type states = {
    [pipelineName]: state,
}

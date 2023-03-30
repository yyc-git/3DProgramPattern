export const pipelineName = "Worker_Main"

export type state = {
    renderWorker: Worker | null,
    physicsWorker: Worker | null,
    renderDataBuffer: SharedArrayBuffer | null,
    renderDataBufferTypeArray: null | Uint32Array,
    renderGameObjectsCount: number | null,
    physicsDataBuffer: SharedArrayBuffer | null,
    physicsDataBufferTypeArray: null | Float32Array
}

export type states = {
    [pipelineName]: state,
}
